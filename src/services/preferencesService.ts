import { supabase } from '../lib/supabase';
import {Database} from "../../types/database.types";

type PreferencesUpdate = Database["public"]["Tables"]["user_preferences"]["Update"];


export const getPreferences = async (userId: string) => {
    const { data, error } = await supabase
        .from("user_preferences")
        .select()
        .eq("user_id", userId);
    return { data, error };
};

export const getPreferenceByName = async (userId: string, preferenceName: string) => {
    const { data, error } = await supabase
        .from("user_preferences")
        .select(preferenceName)
        .eq("user_id", userId);
    return { data, error };
};

export const updatePreferences = async (userId: string, updates: PreferencesUpdate) => {
    const { data, error } = await supabase
        .from("user_preferences")
        .update(updates)
        .select()
        .eq("user_id", userId);
    return { data, error };
};