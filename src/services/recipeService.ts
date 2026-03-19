import { supabase } from '../lib/supabaseClient';

export const getSavedRecipes = async (user_id: string) => { ... };
export const getMadeRecipes = async (user_id: string) => { ... };

// stretch goal feature: createRecipe() (requires new boolean attribute "userUploaded" in recipes)