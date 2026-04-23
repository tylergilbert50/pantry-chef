import { supabase } from "../lib/supabase";
import { Database } from "../../types/database.types";
import { updateIngredient, getIngredients } from "@/services/ingredientService";
import {
  getRecipeInformation,
  getRecipeInformationBulk,
  SpoonacularExtendedIngredient,
  SpoonacularRecipeInformation,
} from "@/services/apiService";
import { convert, convertAmount } from "../utils/conversions";
import { getDensity } from "../utils/densities";

type recipeInsert = Database["public"]["Tables"]["recipes"]["Insert"];
type PantryIngredientRow =
  Database["public"]["Tables"]["pantry_ingredients"]["Row"];

export const getRecipes = async (
  userId: string,
  filters?: { search?: string; saved?: boolean; made?: boolean },
) => {
  let query = supabase.from("recipes").select().eq("user_id", userId);

  if (filters?.saved !== undefined) {
    query = query.eq("saved", filters.saved);
  }
  if (filters?.made === true) {
    query = query.not("made_on", "is", null);
  } else if (filters?.made === false) {
    query = query.is("made_on", null);
  }
  if (filters?.search !== undefined) {
    query = query.ilike("recipe_name", filters.search);
  }

  const { data, error } = await query;
  return { data, error };
};

// this function is used for updating the saved and made_on fields, but note that the use of .upsert() requires all fields are passed in.
export const upsertRecipe = async (recipe: recipeInsert) => {
  const { data, error } = await supabase
    .from("recipes")
    .upsert(recipe)
    .select();
  return { data, error };
};

// a function madeRecipe() will call the above function to update made_on as well as multiple calls to updateIngredient to deduct the right amounts for each

export type MadeRecipeDeduction = {
  ingredientName: string;
  status: "deducted" | "skipped-no-match" | "skipped-no-conversion" | "failed";
  before?: { quantity: number; unit: string };
  after?: { quantity: number; unit: string };
  error?: string;
};

export type MadeRecipeResult = {
  deductions: MadeRecipeDeduction[];
  // True if the recipe row was upserted; false means even that failed.
  markedAsMade: boolean;
};

// Round to 2 decimal places to avoid floating-point noise like 0.9999999 oz
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const madeRecipe = async (
  recipeId: string,
  pantryId: string,
): Promise<MadeRecipeResult> => {
  const data = await getRecipeInformation(Number(recipeId), false);

  // Load the pantry once so we can use shared matching (id + name fallback)
  const { data: pantryItems } = await getIngredients(pantryId);
  const pantryRows = pantryItems ?? [];

  // Build deduction plan up front so we can run them in parallel
  const plan = data.extendedIngredients.map((recipeIng) => {
    const match = findPantryMatch(recipeIng, pantryRows);
    if (!match) {
      return {
        recipeIng,
        match: null,
        reason: "skipped-no-match" as const,
      };
    }

    const after = convert(
      { quantity: match.quantity, unit: match.unit },
      { quantity: recipeIng.amount, unit: recipeIng.unit },
      recipeIng.name,
    );

    if (after == null) {
      return { recipeIng, match, reason: "skipped-no-conversion" as const };
    }

    // Clamp at 0 — never write negative quantities to the DB
    const clamped = Math.max(0, round2(after));
    return { recipeIng, match, after: clamped };
  });

  const deductions: MadeRecipeDeduction[] = await Promise.all(
    plan.map(async (step): Promise<MadeRecipeDeduction> => {
      if ("reason" in step && step.reason === "skipped-no-match") {
        return {
          ingredientName: step.recipeIng.name,
          status: "skipped-no-match",
        };
      }
      if ("reason" in step && step.reason === "skipped-no-conversion") {
        return {
          ingredientName: step.recipeIng.name,
          status: "skipped-no-conversion",
          before: { quantity: step.match!.quantity, unit: step.match!.unit },
        };
      }

      const { match, after, recipeIng } = step as {
        recipeIng: SpoonacularExtendedIngredient;
        match: PantryIngredientRow;
        after: number;
      };

      // Note: `in_stock` is a generated column in the DB — it's computed from
      // `quantity` automatically, so we don't write to it here.
      const { error } = await updateIngredient(match.ingredient_id, {
        quantity: after,
      });

      if (error) {
        console.error(
          `madeRecipe: failed to deduct ${recipeIng.name}:`,
          error.message,
        );
        return {
          ingredientName: recipeIng.name,
          status: "failed",
          before: { quantity: match.quantity, unit: match.unit },
          error: error.message,
        };
      }

      return {
        ingredientName: recipeIng.name,
        status: "deducted",
        before: { quantity: match.quantity, unit: match.unit },
        after: { quantity: after, unit: match.unit },
      };
    }),
  );

  // Mark recipe as made regardless of deduction outcomes (best-effort)
  let markedAsMade = false;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;
    if (!userId) throw new Error("No authenticated user");

    const { data: existing } = await supabase
      .from("recipes")
      .select("saved")
      .eq("recipe_id", recipeId)
      .eq("user_id", userId)
      .single();

    const recipe: recipeInsert = {
      recipe_id: recipeId,
      user_id: userId,
      recipe_name: data.title,
      saved: existing?.saved ?? false,
      made_on: new Date().toISOString().split("T")[0],
    };
    await upsertRecipe(recipe);
    markedAsMade = true;
  } catch (err) {
    console.error("madeRecipe: failed to mark recipe as made:", err);
  }

  return { deductions, markedAsMade };
};

// stretch goal feature: createRecipe() requires:
// new boolean attribute "user_uploaded" in recipes)
// adapt above get{X}Recipe functions into one getRecipes function with filters for saved, made, user_uploaded

// ---------------------------------------------------------------------------
// "Can I make this?" matching logic
// ---------------------------------------------------------------------------

// Ingredients we don't strictly check against the pantry — these are assumed
// to be on hand. Matches the list used in the Recipes feed for search filtering.
const ASSUMED_STAPLES = new Set([
  "salt",
  "pepper",
  "black pepper",
  "water",
  "olive oil",
  "vegetable oil",
  "butter",
  "sugar",
]);

function normalizeForMatch(name: string | null | undefined): string {
  return (name ?? "")
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findPantryMatch(
  recipeIngredient: SpoonacularExtendedIngredient,
  pantryItems: PantryIngredientRow[],
): PantryIngredientRow | null {
  // Prefer spoonacular_id match (most reliable)
  const byId = pantryItems.find(
    (p) => p.spoonacular_id === String(recipeIngredient.id),
  );
  if (byId) return byId;

  // Fall back to normalized name match
  const recipeName = normalizeForMatch(recipeIngredient.name);
  if (!recipeName) return null;
  return (
    pantryItems.find(
      (p) => normalizeForMatch(p.name_normalized) === recipeName,
    ) ?? null
  );
}

export type IngredientAvailability = {
  ingredientName: string;
  needed: { quantity: number; unit: string };
  // "ok" = we verified the pantry has at least this much
  // "missing" = not in pantry at all
  // "insufficient" = in pantry but quantity too low
  // "assumed" = couldn't verify (no density for cross-dim, or staple) — treated as ok
  status: "ok" | "missing" | "insufficient" | "assumed";
  pantryQuantity?: number;
  pantryUnit?: string;
};

export type RecipeAvailability = {
  canMake: boolean;
  ingredients: IngredientAvailability[];
};

/**
 * Given recipe details and the current pantry contents, determine whether
 * the user has enough of every required ingredient to make the recipe.
 *
 * Lenient fallbacks:
 *   - Staples (salt, water, etc.) are assumed available.
 *   - Ingredients where units can't be converted (no density on record)
 *     are assumed available rather than blocking the recipe.
 */
export function canMakeRecipe(
  recipe: SpoonacularRecipeInformation,
  pantryItems: PantryIngredientRow[],
): RecipeAvailability {
  const ingredients = recipe.extendedIngredients ?? [];
  if (ingredients.length === 0) {
    return { canMake: false, ingredients: [] };
  }

  const results: IngredientAvailability[] = [];

  for (const recipeIng of ingredients) {
    const normalized = normalizeForMatch(recipeIng.name);
    const needed = { quantity: recipeIng.amount, unit: recipeIng.unit };

    if (ASSUMED_STAPLES.has(normalized)) {
      results.push({
        ingredientName: recipeIng.name,
        needed,
        status: "assumed",
      });
      continue;
    }

    const match = findPantryMatch(recipeIng, pantryItems);
    if (!match) {
      results.push({
        ingredientName: recipeIng.name,
        needed,
        status: "missing",
      });
      continue;
    }

    // Convert the needed amount into the pantry's unit so we can compare
    const density = getDensity(recipeIng.name);
    const converted = convertAmount(
      recipeIng.amount,
      recipeIng.unit,
      match.unit,
      density,
    );

    if (!converted.ok) {
      // Couldn't convert — lenient fallback. Most common cause: recipe calls
      // for cups of something we don't have a density for.
      results.push({
        ingredientName: recipeIng.name,
        needed,
        status: "assumed",
        pantryQuantity: match.quantity,
        pantryUnit: match.unit,
      });
      continue;
    }

    if (match.quantity >= converted.quantity) {
      results.push({
        ingredientName: recipeIng.name,
        needed,
        status: "ok",
        pantryQuantity: match.quantity,
        pantryUnit: match.unit,
      });
    } else {
      results.push({
        ingredientName: recipeIng.name,
        needed,
        status: "insufficient",
        pantryQuantity: match.quantity,
        pantryUnit: match.unit,
      });
    }
  }

  const canMake = results.every(
    (r) => r.status === "ok" || r.status === "assumed",
  );

  return { canMake, ingredients: results };
}

/**
 * Filter a list of recipes down to those the user can currently make,
 * given their pantry contents. Convenience wrapper around canMakeRecipe.
 */
export function filterMakeableRecipes(
  recipes: SpoonacularRecipeInformation[],
  pantryItems: PantryIngredientRow[],
): SpoonacularRecipeInformation[] {
  return recipes.filter((r) => canMakeRecipe(r, pantryItems).canMake);
}

/**
 * End-to-end helper: given a pantry ID, fetch the pantry and return detailed
 * recipe info filtered to only recipes the user can make. Useful for the
 * Recipes feed.
 */
export async function getMakeableRecipes(
  pantryId: string,
  candidateRecipeIds: number[],
): Promise<SpoonacularRecipeInformation[]> {
  if (candidateRecipeIds.length === 0) return [];

  const { data: pantryItems, error } = await getIngredients(pantryId);
  if (error || !pantryItems) return [];

  const details = await getRecipeInformationBulk(candidateRecipeIds, false);
  return filterMakeableRecipes(details, pantryItems);
}
