import { supabase } from '../lib/supabaseClient';

// no addPreference(); use a trigger on sign up which inserts default rows into preferences
export const getPreferences = async (user_id: string) => { ... };
export const setPreference = async (preferenceName: string, preferenceState: string) => { ... };
export const deleteUserPreferences = async (user_id: string) => { ... };