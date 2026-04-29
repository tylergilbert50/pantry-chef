import { Database } from "../../types/database.types";
import { queryClient } from "../lib/queryClient";
import Constants from 'expo-constants';
import convert from "convert";

export type IngredientInsert =
  Database["public"]["Tables"]["pantry_ingredients"]["Insert"];

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_SPOONACULAR_API_KEY;
const SPOONACULAR_CDN = "https://img.spoonacular.com/ingredients_250x250";

type Unit = "g" | "kg" | "oz" | "lb" | "ml" | "l" | "tsp" | "tbsp" | "cup";
const recipeUnits = {
  volume: ["tsp", "tbsp", "cup", "ml", "l"],
  mass: ["g", "kg", "oz", "lb"],
};

export interface SpoonacularProduct {
  title: string;
  brand: string;
  image?: string;
  id: number;
  aisle?: string;
}

export type SpoonacularIngredient = {
    name: string;
    original: string;
    image: string;
    id: number;
    aisle: string;
    amount: number;
    unit: string;
    possibleUnits: Array<string>;
}

export type InputIngredient = {
  name: string;
  original: string;
  image: string;
  id: number;
  unit: string;
  amount: number;
};

export type IngredientMatch = {
  ingredient: SpoonacularExtendedIngredient;
  match: {
    completeMatch: boolean;
    missingAmount: number;
    missingUnit: string;
  };
};

export type IngredientMatches = Array<IngredientMatch>;

export type PantryIngredients = Array<InputIngredient>;

export type SpoonacularExtendedIngredient = {
  aisle: string;
  amount: number;
  id: number;
  image: string;
  measures: {
    metric: {
      amount: number;
      unitLong: string;
      unitShort: string;
    };
    us: {
      amount: number;
      unitLong: string;
      unitShort: string;
    };
  };
  meta: Array<string>;
  name: string;
  original: string;
  originalName: string;
  unit: string;
};

export type SpoonacularRecipe = {
  id: number;
  title: string;
  image: string;
  imageTYpe: string;
  likes: number;
  missedIngredientCount: number;
  missedIngredients: Array<SpoonacularIngredient>;
  usedIngredientCount: number;
  usedIngredients: Array<SpoonacularIngredient>;
};

export type SpoonacularRecipeInformation = {
  id: number;
  title: string;
  image: string;
  imageType: string;
  servings: number;
  readyInMinutes: number;
  cookingMinutes: number;
  preparationMinutes: number;
  license: string;
  sourceName: string;
  sourceURL: string;
  spoonacularSourceUrl: string;
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  analyzedInstructions: Array<string>;
  cheap: boolean;
  creditsText: string;
  cuisines: Array<string>;
  dairyFree: boolean;
  diets: Array<string>;
  gaps: boolean;
  instructions: string;
  glutenFree: boolean;
  ketogenic: boolean;
  lowFodmap: boolean;
  occasions: [];
  sustainable: boolean;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  whole30: boolean;
  weightWatcherSmartPoints: number;
  dishTypes: Array<string>;
  extendedIngredients: SpoonacularExtendedIngredientList;
  summary: string;
};

export type SpoonacularEquipmentItem = {
  id: number;
  image: string;
  name: string;
  temperature: {
    number: number;
    unit: string;
  };
};

export type SpoonacularEquipmentList = Array<SpoonacularEquipmentItem>;

export type SpoonacularRecipeStep = {
  equipment: SpoonacularEquipmentList;
  ingredients: SpoonacularIngredientList;
  number: number;
  step: string;
};

export type SpoonacularRecipeInstructions = {
  name: string;
  steps: Array<SpoonacularRecipeStep>;
};

export type SpoonacularRecipeList = Array<SpoonacularRecipe>;
export type SpoonacularIngredientList = Array<SpoonacularIngredient>;
export type SpoonacularExtendedIngredientList =
  Array<SpoonacularExtendedIngredient>;
export type SpoonacularRecipeInformationList =
  Array<SpoonacularRecipeInformation>;

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

const fetchBarcode = async (upc: string): Promise<SpoonacularProduct> => {
  console.log(
    new Date().toLocaleString(),
    "fetchBarcode: fetching spoonacular.com for UPC: ",
    upc,
  );
  const result = await fetch(
    `https://api.spoonacular.com/food/products/upc/${upc}?apiKey=${SPOONACULAR_API_KEY}`,
  );
  if (!result.ok) throw new Error("Network response wasn't okay");
  const data: SpoonacularProduct = await result.json();

  return {
    title: data.title,
    brand: data.brand || "Unknown Brand",
    image: data.image,
    id: data.id,
    aisle: data.aisle,
  };
};

export type IngredientInfo = {
  id: number | null;
  imageUrl: string | null;
};

const fetchIngredientInfo = async (name: string): Promise<IngredientInfo> => {
  console.log(
    new Date().toLocaleString(),
    "fetchIngredientInfo: fetching spoonacular.com for: ",
    name,
  );
  const result = await fetch(
    `https://api.spoonacular.com/food/ingredients/autocomplete?query=${encodeURIComponent(name)}&number=1&metaInformation=true&apiKey=${SPOONACULAR_API_KEY}`,
  );
  if (!result.ok) throw new Error("Network response wasn't okay");
  const data: SpoonacularIngredientList = await result.json();
  if (data.length < 1) return { id: null, imageUrl: null };
  const ingredient = data[0];
  return {
    id: ingredient.id ?? null,
    imageUrl: ingredient.image
      ? `${SPOONACULAR_CDN}/${ingredient.image}`
      : null,
  };
};

const fetchImage = async (name: string): Promise<string | undefined> => {
  const info = await fetchIngredientInfo(name);
  return info.imageUrl ?? undefined;
};

const fetchRecipes = async (
  ingredients: string,
  numberOfRecipes: number,
  ranking: number,
  ignorePantry: boolean,
): Promise<SpoonacularRecipeList> => {
  console.log("Attempting to fetch recipes...");
  const result = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=${numberOfRecipes}&ranking=${ranking}&ignorePantry=${encodeURIComponent(ignorePantry)}&apiKey=${SPOONACULAR_API_KEY}`,
  );
  if (!result.ok) throw new Error("Network response wasn't okay");
  const data: SpoonacularRecipeList = await result.json();
  return data;
};

const fetchRecipeInformation = async (
  id: number,
  includeNutrition: boolean,
): Promise<SpoonacularRecipeInformation> => {
  console.log("Attempting to fetch recipe information...");
  const result = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=${includeNutrition}&apiKey=${SPOONACULAR_API_KEY}`,
  );
  if (!result.ok) throw new Error("Network response wasn't okay");
  const data: SpoonacularRecipeInformation = await result.json();
  return data;
};

const fetchRecipeInformationBulk = async (
  ids: number[],
  includeNutrition: boolean,
): Promise<SpoonacularRecipeInformationList> => {
  console.log("Attempting to fetch recipe information in bulk...");
  const result = await fetch(
    `https://api.spoonacular.com/recipes/informationBulk?includeNutrition=${encodeURIComponent(includeNutrition)}&ids=${ids.join(",")}&apiKey=${SPOONACULAR_API_KEY}`,
  );
  if (!result.ok) throw new Error("Network response wasn't okay");
  const data: SpoonacularRecipeInformationList = await result.json();
  return data;
};

const fetchRecipeInstructions = async (
  id: number,
): Promise<SpoonacularRecipeInstructions> => {
  console.log("Attempting to get recipe instructions...");
  const result = await fetch(
    `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}`,
  );
  console.log(result);
  if (!result.ok) throw new Error("Network response wasn't okay");
  const data: SpoonacularRecipeInstructions = await result.json();
  return data;
};

export async function lookupBarcode(upc: string): Promise<SpoonacularProduct> {
  console.log("Attempting to get UPC data...");
  const data = await queryClient.fetchQuery({
    queryKey: ["upc", upc], // Unique cache key
    queryFn: () => fetchBarcode(upc),
  });
  if (data === null) {
    throw new Error("Data from lookupBarcode is null");
  }
  return data;
}

export async function searchIngredientImage(
  name: string,
): Promise<string | undefined> {
  const imageName = await queryClient.fetchQuery({
    queryKey: ["imageName", name],
    queryFn: () => fetchImage(name),
  });
  return imageName;
}

export async function searchIngredientInfo(
  name: string,
): Promise<IngredientInfo> {
  const info = await queryClient.fetchQuery({
    queryKey: ["ingredientInfo", name],
    queryFn: () => fetchIngredientInfo(name),
  });
  return info;
}

export async function searchRecipes(
  ingredients: string,
  numberOfRecipes: number,
  ranking: number,
  ignorePantry: boolean,
): Promise<SpoonacularRecipeList> {
  if (numberOfRecipes < 1 || numberOfRecipes > 100) {
    throw new Error(
      "Number of recipes to return must be between 1 and 100 inclusive.",
    );
  }
  if (ranking != 1 && ranking != 2) {
    throw new Error("Error: Rank must be 1 or 2.");
  }
  const data = await queryClient.fetchQuery({
    queryKey: [
      "recipeSearch",
      ingredients,
      "numberOfRecipes",
      numberOfRecipes,
      "ranking",
      ranking,
      "ignorePantry",
      ignorePantry,
    ], // Unique cache key
    queryFn: () =>
      fetchRecipes(ingredients, numberOfRecipes, ranking, ignorePantry),
  });
  return data;
}

export async function getRecipeInformation(
  id: number,
  includeNutrition: boolean,
): Promise<SpoonacularRecipeInformation> {
  const data = await queryClient.fetchQuery({
    queryKey: ["recipeId", id], // Unique cache key
    queryFn: () => fetchRecipeInformation(id, includeNutrition),
  });
  return data;
}

export async function getRecipeInstructions(
  id: number,
): Promise<SpoonacularRecipeInstructions> {
  const data = await queryClient.fetchQuery({
    queryKey: ["recipeInstructionsId", id], // Unique cache key
    queryFn: () => fetchRecipeInstructions(id),
  });
  return data;
}

export async function getRecipeInformationBulk(
  ids: number[],
  includeNutrition: boolean,
): Promise<SpoonacularRecipeInformationList> {
  const data = await queryClient.fetchQuery({
    queryKey: [
      "recipeInstructionsId",
      ids,
      "includeNutrition",
      includeNutrition,
    ], // Unique cache key
    queryFn: () => fetchRecipeInformationBulk(ids, includeNutrition),
  });
  return data;
}

function parseUnit(input: string): Unit {
  const normalized = input.trim().toLowerCase();

  const map: Record<string, Unit> = {
    grams: "g",
    gram: "g",
    g: "g",
    kilograms: "kg",
    kg: "kg",
    cups: "cup",
    cup: "cup",
  };
  const result = map[normalized];
  return result;
}

export async function matchRecipeIngredients(
  ingredients: SpoonacularExtendedIngredientList,
  pantryIngredients: PantryIngredients,
): Promise<IngredientMatches> {
  // Loop over ingredients
  //  Attempt to find a match from the pantry ingredients
  //  Check that the total amount is available
  //  Create a new IngredientMatch object for each ingredient
  const matches: IngredientMatches = [];
  ingredients.forEach((recipeIngredient) => {
    let amountNeeded = recipeIngredient.amount;
    let amountUnit: string;
    let recipeIngredientAmount: number;
    let pantryIngredientAmount: number;
    for (let i = 0; i < pantryIngredients.length; i++) {
      let amountFound = 0;
      const pantryIngredient = pantryIngredients[i];
      amountUnit = recipeIngredient.unit;
      if (recipeIngredient.name === pantryIngredient.name) {
        // At this point, we've found the ingredient we need, now to check if the necessary amount is available.
        if (
          recipeUnits.mass.indexOf(recipeIngredient.unit) >= 0 &&
          recipeUnits.mass.indexOf(pantryIngredient.unit) >= 0
        ) {
          // Normalize to grams
          recipeIngredientAmount = convert(
            recipeIngredient.amount,
            parseUnit(recipeIngredient.unit),
          ).to("g");
          pantryIngredientAmount = convert(
            recipeIngredient.amount,
            parseUnit(pantryIngredient.unit),
          ).to("g");
        } else if (
          recipeUnits.volume.indexOf(recipeIngredient.unit) >= 0 &&
          recipeUnits.volume.indexOf(pantryIngredient.unit) >= 0
        ) {
          // Normalize to milliliters
          recipeIngredientAmount = convert(
            recipeIngredient.amount,
            parseUnit(recipeIngredient.unit),
          ).to("ml");
          pantryIngredientAmount = convert(
            recipeIngredient.amount,
            parseUnit(pantryIngredient.unit),
          ).to("ml");
        } else if (
          recipeIngredient.unit == "ea" &&
          pantryIngredient.unit == "ea"
        ) {
          // Continue with "ea" (each)
          recipeIngredientAmount = recipeIngredient.amount;
          pantryIngredientAmount = pantryIngredient.amount;
        } else {
          // Volume vs mass mismatch
          console.log(
            "Volume vs mass mismatch on ingredients: ",
            recipeIngredient,
            pantryIngredient,
          );
          continue; // TODO: throw an error maybe?
        }
        if (pantryIngredientAmount >= recipeIngredientAmount) {
          amountFound = recipeIngredient.amount;
          amountUnit = recipeIngredient.unit;
        } else {
          amountFound += pantryIngredientAmount;
        }
      }
      matches.push({
        ingredient: recipeIngredient,
        match: {
          completeMatch: amountFound >= amountNeeded,
          missingAmount: amountNeeded - amountFound,
          missingUnit: amountUnit,
        },
      });
    }
  });
  return matches;
}
