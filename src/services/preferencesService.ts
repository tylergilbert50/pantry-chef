import { supabase } from '../lib/supabase';
import {Database} from "../../types/database.types";

type PreferencesUpdate = Database["public"]["Tables"]["user_preferences"]["Update"];

// no addPreference(); use a trigger on sign up which inserts default rows into preferences
// create a postgres function to set preferences to default, then call it from the resetPreferences here in addition to when the user creates their profile

export const getPreferences = async (userId: string) => {
    const { data, error } = await supabase
        .from("user_preferences")
        .select('*')
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

export const resetPreferences = async (userId: string) => {
    // fix me
};
