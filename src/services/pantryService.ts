import { supabase } from '../lib/supabaseClient';

export const createPantry = async (name: string) => { ... };
export const getPantry = async (pantryId: string) => { ... };
export const renamePantry = async (pantryId: string, name: string) => { ... };
export const deletePantry = async (pantryId: string) => { ... };
export const addUserToPantry = async (userId: string, pantryId: string) => { ... };
export const removeUserFromPantry = async (userId: string) => { ... };
export const getPantryMembers = async (pantryId: string) => { ... };