import { supabase } from '../lib/supabase';

export const addUserToPantry = async (userId: string, pantryId: string) => {
    const { data, error } = await supabase
        .from("users")
        .update({pantry_id: pantryId})
        .eq("user_id", userId)
        .select('pantry_id')
        .single();
    return { data, error };
};
export const removeUserFromPantry = async (userId: string) => {
    const { data, error } = await supabase
        .from("users")
        .update({pantry_id: null})
        .eq("user_id", userId)
        .select('pantry_id')
        .single();
    return { data, error };
};
export const getPantryMembers = async (pantryId: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("pantry_id", pantryId);
    return { data, error };
};