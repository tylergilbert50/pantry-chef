import { supabase } from "../lib/supabase";
import { Database } from "../../types/database.types";
import { searchIngredientImage } from "./apiService";

type IngredientInsert =
  Database["public"]["Tables"]["pantry_ingredients"]["Insert"];
type IngredientUpdate =
  Database["public"]["Tables"]["pantry_ingredients"]["Update"];
type IngredientRow = Database["public"]["Tables"]["pantry_ingredients"]["Row"];

interface IngredientFilters {
  search?: string;
  category?: string;
}

export const addIngredient = async (ingredient: IngredientInsert) => {
  const { data, error } = await supabase
    .from("pantry_ingredients")
    .insert(ingredient)
    .select();
  return { data, error };
};

export const deleteIngredient = async (
  ingredientID: string,
  pantryID: string,
) => {
  const { error } = await supabase
    .from("pantry_ingredients")
    .delete()
    .eq("ingredient_id", ingredientID)
    .eq("pantry_id", pantryID);
  return { error };
};

export const updateIngredient = async (
  ingredientId: string,
  pantryId: string,
  updates: IngredientUpdate,
) => {
  const { data, error } = await supabase
    .from("pantry_ingredients")
    .update(updates)
    .select()
    .eq("ingredient_id", ingredientId)
    .eq("pantry_id", pantryId);
  return { data, error };
};

export const getIngredients = async (
  pantryId: string,
  filters?: IngredientFilters,
) => {
  let query = supabase
    .from("pantry_ingredients")
    .select()
    .eq("pantry_id", pantryId);

  if (filters?.search) {
    query = query.ilike("name_normalized", `%${filters.search}%`);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export async function backfillImages(
  ingredients: IngredientRow[],
  pantryId: string,
) {
  const missing = ingredients.filter((item) => item.image == null);
  if (missing.length === 0) return;

  for (const item of missing) {
    try {
      const imageUrl = await searchIngredientImage(item.name_product);
      const resolved = imageUrl ?? "";
      await updateIngredient(item.ingredient_id, pantryId, { image: resolved });
      item.image = resolved;
    } catch {}
  }
}
