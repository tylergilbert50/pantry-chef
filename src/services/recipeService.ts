import { supabase } from '../lib/supabase';

export const getSavedRecipes = async (userId: string) => {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .eq('saved', true);
    return { data, error };
};
export const getMadeRecipes = async (userId: string) => {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .not('made_on', 'is',null);
    return { data, error };
};

// stretch goal feature: createRecipe() requires:
// new boolean attribute "user_uploaded" in recipes)
// adapt above get{X}Recipe functions into one getRecipes function with filters for saved, made, user_uploaded