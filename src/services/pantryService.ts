import { supabase } from '../lib/supabase';
import {Database} from "../../types/database.types";

type pantryInsert = Database['public']['Tables']['pantries']['Insert'];


export const createPantry = async (pantry: pantryInsert) => {
    const { data, error } = await supabase
        .from('pantries')
        .insert( pantry )
        .select();
    return { data, error };
};

export const getPantry = async (pantryId: string) => {
    const { data, error } = await supabase
        .from('pantries')
        .select('*')
        .eq('pantry_id', pantryId);
    return { data, error };
};

// no need to edit any attributes besides name. last_updated will be updated through a trigger
export const renamePantry = async (pantryId: string, name: string) => {
    const { data, error } = await supabase
        .from("pantries")
        .update({pantry_name: name})
        .eq("pantry_id", pantryId)
        .select('pantry_name')
        .single();
    return { data, error };
};

export const deletePantry = async (pantryId: string) => {
    const { error } = await supabase
        .from('pantries')
        .delete()
        .eq('pantry_id', pantryId)
    return { error };
};