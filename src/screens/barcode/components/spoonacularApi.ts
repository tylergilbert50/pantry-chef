import { Database } from "../../../../types/database.types";

export type IngredientInsert =
  Database["public"]["Tables"]["pantry_ingredients"]["Insert"];

const SPOONACULAR_API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;
const SPOONACULAR_CDN = "https://img.spoonacular.com/ingredients_250x250";

export interface SpoonacularProduct {
  title: string;
  brand: string;
  image?: string;
  id: number;
  aisle?: string;
}

export function mapAisleToCategory(aisle?: string): string {
  if (!aisle) return "Other";
  const lower = aisle.toLowerCase();

  if (
    lower.includes("meat") ||
    lower.includes("seafood") ||
    lower.includes("protein")
  )
    return "Protein";
  if (lower.includes("vegetable") || lower.includes("produce"))
    return "Vegetable";
  if (lower.includes("fruit")) return "Fruit";
  if (
    lower.includes("dairy") ||
    lower.includes("milk") ||
    lower.includes("cheese") ||
    lower.includes("egg")
  )
    return "Dairy";
  if (
    lower.includes("bread") ||
    lower.includes("bakery") ||
    lower.includes("grain") ||
    lower.includes("pasta") ||
    lower.includes("cereal")
  )
    return "Grain";
  if (
    lower.includes("condiment") ||
    lower.includes("sauce") ||
    lower.includes("spice") ||
    lower.includes("seasoning")
  )
    return "Condiment";
  if (lower.includes("oil") || lower.includes("vinegar")) return "Oil";
  if (lower.includes("beverage") || lower.includes("drink")) return "Beverage";
  if (lower.includes("frozen")) return "Frozen";
  if (lower.includes("canned") || lower.includes("jarred")) return "Canned";
  if (lower.includes("snack")) return "Snack";
  return "Other";
}

export function normalizeName(title: string): string {
  return title.toLowerCase().replace(/[®™©]/g, "").trim();
}

export async function lookupBarcode(upc: string): Promise<SpoonacularProduct> {
  const res = await fetch(
    `https://api.spoonacular.com/food/products/upc/${upc}?apiKey=${SPOONACULAR_API_KEY}`,
  );
  const data = await res.json();

  if (!res.ok || !data.title) {
    throw new Error("Product not found");
  }

  return {
    title: data.title,
    brand: data.brand || "Unknown Brand",
    image: data.image,
    id: data.id,
    aisle: data.aisle,
  };
}

export async function searchIngredientImage(
  name: string,
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.spoonacular.com/food/ingredients/autocomplete?query=${encodeURIComponent(name)}&number=1&metaInformation=true&apiKey=${SPOONACULAR_API_KEY}`,
    );
    const data = await res.json();

    if (!res.ok || !Array.isArray(data) || data.length === 0) {
      return undefined;
    }

    const ingredient = data[0];
    if (ingredient.image) {
      return `${SPOONACULAR_CDN}/${ingredient.image}`;
    }

    return undefined;
  } catch {
    return undefined;
  }
}
