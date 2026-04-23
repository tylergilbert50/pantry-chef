import { supabase } from "../lib/supabase";
import { Database } from "../../types/database.types";
import {
  getIngredientBySpoonacularId,
  updateIngredient,
  getIngredients,
} from "@/services/ingredientService";
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

export const madeRecipe = async (recipeId: string, pantryId: string) => {
  const data = await getRecipeInformation(Number(recipeId), false);
  for (const i of data.extendedIngredients) {
    const { data: match } = await getIngredientBySpoonacularId(pantryId, i.id);
    if (match) {
      const before = { quantity: match.quantity, unit: match.unit };
      const deduct = { quantity: i.amount, unit: i.unit };
      const after = convert(before, deduct, i.name);
      if (after != null) {
        await updateIngredient(match.ingredient_id, { quantity: after });
      }
    }
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user!.id;

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
