import { supabase } from '../lib/supabase';
import {Database} from "../../types/database.types";

type PantryInsert = Database['public']['Tables']['pantries']['Insert'];


export const createPantry = async (pantry: PantryInsert) => {
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

export const renamePantry = async (pantryId: string, name: string) => { ... };

export const deletePantry = async (pantryId: string) => {
    const { error } = await supabase
        .from('pantries')
        .delete()
        .eq('pantry_id', pantryId)
    return { error };
};
export const addUserToPantry = async (userId: string, pantryId: string) => { ... };
export const removeUserFromPantry = async (userId: string) => { ... };
export const getPantryMembers = async (pantryId: string) => { ... };