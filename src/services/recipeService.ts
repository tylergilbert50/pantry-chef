import { supabase } from "../lib/supabase";
import { Database } from "../../types/database.types";
import {
  getIngredientBySpoonacularId,
  updateIngredient,
} from "@/services/ingredientService";
import { getRecipeInformation } from "@/services/apiService";
import { convert } from "../utils/conversions";

type recipeInsert = Database["public"]["Tables"]["recipes"]["Insert"];

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
};

// a function madeRecipe() will call the above function to update made_on as well as multiple calls to updateIngredient to deduct the right amounts for each

export const madeRecipe = async (recipeId: string, pantryId: string) => {
  const data = await getRecipeInformation(Number(recipeId), false);
  for (const i of data.extendedIngredients) {
    const { data: match, error } = await getIngredientBySpoonacularId(
      pantryId,
      i.id,
    );
    if (match) {
      const before = { quantity: match.quantity, unit: match.unit };
      const deduct = { quantity: i.amount, unit: i.unit };
      const after = convert(before, deduct);
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
