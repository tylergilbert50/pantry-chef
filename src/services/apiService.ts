import { Database } from "../../types/database.types";
import { queryClient } from "../../App";

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

export type SpoonacularIngredient = {
    name: string;
    original: string;
    image: string;
    id: number;
    aisle: string;
    possibleUnits: Array<string>;
}

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
}

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
    extendedIngredients: SpoonacularIngredientList;
    summary: string;

}

export type SpoonacularEquipmentItem = {
    id: number;
    image: string;
    name: string;
    temperature: {
        number: number;
        unit: string;
    };
}

export type SpoonacularEquipmentList = Array<SpoonacularEquipmentItem>;

export type SpoonacularRecipeStep = {
    equipment: SpoonacularEquipmentList;
    ingredients: SpoonacularIngredientList;
    number: number;
    step: string;
}

export type SpoonacularRecipeInstructions = {
    name: string;
    steps: Array<SpoonacularRecipeStep>;
} 

export type SpoonacularRecipeList = Array<SpoonacularRecipe>;
export type SpoonacularIngredientList = Array<SpoonacularIngredient>;
export type SpoonacularRecipeInformationList = Array<SpoonacularRecipeInformation>;

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
    console.log(new Date().toLocaleString(), "fetchBarcode: fetching spoonacular.com for UPC: ", upc);
    const result = await fetch(`https://api.spoonacular.com/food/products/upc/${upc}?apiKey=${SPOONACULAR_API_KEY}`)
    if (!result.ok) throw new Error("Network response wasn't okay");
    const data: SpoonacularProduct = await result.json();

    return {
        title: data.title,
        brand: data.brand || "Unknown Brand",
        image: data.image,
        id: data.id,
        aisle: data.aisle,
    };
}

const fetchImage = async (name: string): Promise<string | undefined> => {
    console.log(new Date().toLocaleString(), "fetchImage: fetching spoonacular.com for: ", name);
    const result = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${encodeURIComponent(name)}&number=1&metaInformation=true&apiKey=${SPOONACULAR_API_KEY}`);
    if (!result.ok) throw new Error("Network response wasn't okay");
    const data: SpoonacularIngredientList = await result.json();
    if (data.length < 1) throw new Error("Ingredient list is empty.");
    const ingredient = data[0];
    if (ingredient.image) {
        return `${SPOONACULAR_CDN}/${ingredient.image}`;
    }
    return undefined;
}

const fetchRecipes = async (ingredients: string, numberOfRecipes: number, ranking: number, ignorePantry: boolean): Promise<SpoonacularRecipeList> => {
    console.log("Attempting to fetch recipes...");
    const result = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=${numberOfRecipes}&ranking=${ranking}&ignorePantry=${encodeURIComponent(ignorePantry)}&apiKey=${SPOONACULAR_API_KEY}`);
    if (!result.ok) throw new Error("Network response wasn't okay");
    const data: SpoonacularRecipeList = await result.json();
    return data;
}

const fetchRecipeInformation = async (id: number, includeNutrition: boolean): Promise<SpoonacularRecipeInformation> => {
    console.log("Attempting to fetch recipe information...");
    const result = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=${includeNutrition}&apiKey=${SPOONACULAR_API_KEY}`);
    if (!result.ok) throw new Error("Network response wasn't okay");
    const data: SpoonacularRecipeInformation = await result.json();
    return data;
}

const fetchRecipeInformationBulk = async (ids: number[], includeNutrition: boolean): Promise<SpoonacularRecipeInformationList> => {
    console.log("Attempting to fetch recipe information in bulk...");
    const result = await fetch(`https://api.spoonacular.com/recipes/informationBulk?includeNutirition=${encodeURIComponent(includeNutrition)}&ids=${ids.join(",")}&apiKey=${SPOONACULAR_API_KEY}`);
    if (!result.ok) throw new Error("Network response wasn't okay");
    const data: SpoonacularRecipeInformationList = await result.json();
    return data;
}

const fetchRecipeInstructions = async (id: number): Promise<SpoonacularRecipeInstructions> => {
    console.log("Attempting to get recipe instructions...");
    const result = await fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}`);
    console.log(result);
    if (!result.ok) throw new Error("Network response wasn't okay");
    const data: SpoonacularRecipeInstructions = await result.json();
    return data;
}

export async function lookupBarcode(upc: string): Promise<SpoonacularProduct> {
    console.log("Attempting to get UPC data...");
    const data = await queryClient.fetchQuery({
        queryKey: ['upc', upc], // Unique cache key
        queryFn: () => fetchBarcode(upc)
    });
    if (data === null) {
        throw new Error("Data from lookupBarcode is null");
    }
    return data;
}

export async function searchIngredientImage(name: string): Promise<string | undefined> {
    const imageName = await queryClient.fetchQuery({
        queryKey: ['imageName', name], // Unique cache key
        queryFn: () => fetchImage(name)
    });
    return imageName;
}

export async function searchRecipes(ingredients: string, numberOfRecipes: number, ranking: number, ignorePantry: boolean): Promise<SpoonacularRecipeList> {
    if (numberOfRecipes < 1 || numberOfRecipes > 100) {
        throw new Error("Number of recipes to return must be between 1 and 100 inclusive.");
    }
    if (ranking != 1 && ranking != 2) {
        throw new Error("Error: Rank must be 1 or 2.");
    }
    const data = await queryClient.fetchQuery({
        queryKey: ['recipeSearch', ingredients, 'numberOfRecipes', numberOfRecipes, 'ranking', ranking, 'ignorePantry', ignorePantry], // Unique cache key
        queryFn: () => fetchRecipes(ingredients, numberOfRecipes, ranking, ignorePantry),
    });
    return data;
}

export async function getRecipeInformation(id: number, includeNutrition: boolean): Promise<SpoonacularRecipeInformation> {
    const data = await queryClient.fetchQuery({
        queryKey: ['recipeId', id], // Unique cache key
        queryFn: () => fetchRecipeInformation(id, includeNutrition),
    });
    return data;
}

export async function getRecipeInstructions(id: number): Promise<SpoonacularRecipeInstructions> {
    const data = await queryClient.fetchQuery({
        queryKey: ['recipeInstructionsId', id], // Unique cache key
        queryFn: () => fetchRecipeInstructions(id),
    });
    return data;
}

export async function getRecipeInformationBulk(ids: number[], includeNutrition: boolean): Promise<SpoonacularRecipeInformationList> {
    const data = await queryClient.fetchQuery({
        queryKey: ['recipeInstructionsId', ids, 'includeNutrition', includeNutrition], // Unique cache key
        queryFn: () => fetchRecipeInformationBulk(ids, includeNutrition),
    });
    return data;
}