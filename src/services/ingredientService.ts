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

export const deleteAllPantryIngredients = async (
  pantryID: string,
) => {
  const { error } = await supabase
    .from("pantry_ingredients")
    .delete()
    .eq("pantry_id", pantryID);
  return { error };
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
  updates: IngredientUpdate,
) => {
  const { data, error } = await supabase
    .from("pantry_ingredients")
    .update(updates)
    .select()
    .eq("ingredient_id", ingredientId)
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

export const getIngredientById = async (pantryId: string, ingredientId: string) => {
  const { data, error } = await supabase
    .from("pantry_ingredients")
    .select()
    .eq("pantry_id", pantryId)
    .eq("ingredient_id", ingredientId)
    .single();
  return { data, error };
};

export const getIngredientBySpoonacularId = async (pantryId: string, spoonacularId: number) => {
  const { data, error } = await supabase
    .from("pantry_ingredients")
    .select()
    .eq("pantry_id", pantryId)
    .eq("spoonacular_id", spoonacularId.toString())
    .single();
  return { data, error };
};

export const getIngredientByName = async (pantryId: string, name: string) => {
  const { data, error } = await supabase
    .from("pantry_ingredients")
    .select()
    .eq("pantry_id", pantryId)
    .ilike("name_normalized", name.toLowerCase())
    .single();
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
      await updateIngredient(item.ingredient_id, { image: resolved });
      item.image = resolved;
    } catch {}
  }
}
