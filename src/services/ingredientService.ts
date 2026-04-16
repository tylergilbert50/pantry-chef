import { supabase } from "../lib/supabase";
import { Database } from "../../types/database.types";
import { searchIngredientImage } from "./apiService";

type IngredientInsert =
  Database["public"]["Tables"]["pantry_ingredients"]["Insert"];
type IngredientUpdate =
  Database["public"]["Tables"]["pantry_ingredients"]["Update"];
type IngredientRow = Database["public"]["Tables"]["pantry_ingredients"]["Row"];

interface quantityFilter {
  operator: "lt" | "gt" | "lte" | "gte" | "eq";
  quantity: number;
  unit: string;
}

interface IngredientFilters {
  search?: string;
  category?: string;
  flags?: string[];
  quantity?: quantityFilter;
}

// todo: develop system for universally storing ingredient quantities as grams in the backend, with fields low_stock_threshold and grams_per_each
// when an ingredient is added, the following should happen
// 1) grams_per_each fetched and stored
// 2) the unit provided by the user is converted and stored (this should also happen upon update)
// 3) the category of the item is used to determine a default low_stock_threshold (exists as trigger)
// when the ingredients are used, the gram weight is deducted from, and when the quantity in storage falls below the threshold that is considered low, the item is flagged

export const addIngredient = async (ingredient: IngredientInsert) => {
  const { data, error } = await supabase
    .from("pantry_ingredients")
    .insert(ingredient)
    .select();
  return { data, error };
};

export const deleteIngredient = async (
  ingredientID: number,
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
  ingredientId: number,
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

  if (filters?.flags && filters?.flags.length > 0) {
    query = query.in("flag", filters.flags);
  }

  if (filters?.quantity) {
    const { operator, quantity, unit } = filters.quantity;
    query = query.eq("unit", unit);
    switch (operator) {
      case "lt":
        query = query.lt("quantity", quantity);
        break;
      case "gt":
        query = query.gt("quantity", quantity);
        break;
      case "lte":
        query = query.lte("quantity", quantity);
        break;
      case "gte":
        query = query.gte("quantity", quantity);
        break;
      case "eq":
        query = query.eq("quantity", quantity);
        break;
    }
  }
  const { data, error } = await query;
  return { data, error };
};

export async function backfillImages(
  ingredients: IngredientRow[],
  pantryId: string,
) {
  const missing = ingredients.filter((item) => !item.image);
  if (missing.length === 0) return;

  for (const item of missing) {
    try {
      const imageUrl = await searchIngredientImage(item.name_product);
      if (imageUrl) {
        await supabase
          .from("pantry_ingredients")
          .update({ image: imageUrl })
          .eq("ingredient_id", item.ingredient_id)
          .eq("pantry_id", pantryId);

        item.image = imageUrl;
      }
    } catch {}
  }
}
