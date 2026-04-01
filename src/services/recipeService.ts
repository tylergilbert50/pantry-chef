import { supabase } from '../lib/supabase';
import {Database} from "../../types/database.types";

type recipeInsert = Database["public"]["Tables"]["recipes"]["Insert"];

export const getRecipes = async (userId: string, filters?: { search?: string; saved?: boolean; made?: boolean }) => {
    let query = supabase
        .from('recipes')
        .select()
        .eq('user_id', userId);

    if (filters?.saved !== undefined) {
        query = query.eq('saved', filters.saved);
    }
    if (filters?.made === true) {
        query = query.not('made_on', 'is', null);
    } else if (filters?.made === false) {
        query = query.is('made_on', null);
    }
    if (filters?.search !== undefined) {
        query = query.ilike('recipe_name', filters.search);
    }

    const { data, error } = await query;
    return { data, error };
};

// this function is used for updating the saved and made_on fields, but note that the use of .upsert() requires all fields are passed in.
export const upsertRecipe = async (recipeId: string, userId: string, recipe: recipeInsert) => {
    const { data, error } = await supabase
        .from('recipes')
        .upsert(recipe)
        .select()
};

// a function madeRecipe() will call the above function to update made_on as well as multiple calls to updateIngredient to deduct the right amounts for each



// stretch goal feature: createRecipe() requires:
// new boolean attribute "user_uploaded" in recipes)
// adapt above get{X}Recipe functions into one getRecipes function with filters for saved, made, user_uploaded