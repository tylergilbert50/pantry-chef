import { supabase } from "../lib/supabase";

export type PantryIngredient = {
  id: string;
  name: string;
  quantity: number;
  amount: string;
  calories?: number;
  image?: string;
};

export async function getPantryIngredients(
  pantryId: string,
): Promise<PantryIngredient[]> {
  const { data, error } = await supabase
    .from("pantry_ingredients")
    .select("*")
    .eq("pantry_id", pantryId);

  if (error) {
    console.error("Fetch error:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.ingredient_id,
    name: item.name_product,
    quantity: item.quantity ?? 0,
    amount: `${item.quantity ?? 0} ${item.unit ?? ""}`,
    calories: item.calories ?? undefined,
    image: item.image ?? undefined,
  }));
}
