import { supabase } from "../lib/supabase";
import { searchIngredientImage } from "../screens/barcode/components/spoonacularApi";

export type PantryIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  amount: string;
  calories?: number;
  image?: string;
  expirationDate?: string;
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

  const ingredients: PantryIngredient[] = data.map((item) => ({
    id: item.ingredient_id,
    name: item.name_product,
    quantity: item.quantity ?? 0,
    unit: item.unit ?? "",
    category: item.category ?? "",
    amount: `${item.quantity ?? 0} ${item.unit ?? ""}`,
    calories: item.calories ?? undefined,
    image: item.image ?? undefined,
    expirationDate: item.expiration_date ?? undefined,
  }));

  backfillImages(ingredients, pantryId);

  return ingredients;
}

async function backfillImages(
  ingredients: PantryIngredient[],
  pantryId: string,
) {
  const missing = ingredients.filter((item) => !item.image);
  if (missing.length === 0) return;

  for (const item of missing) {
    try {
      const imageUrl = await searchIngredientImage(item.name);
      if (imageUrl) {
        await supabase
          .from("pantry_ingredients")
          .update({ image: imageUrl })
          .eq("ingredient_id", item.id)
          .eq("pantry_id", pantryId);

        item.image = imageUrl;
      }
    } catch {
    }
  }
}
