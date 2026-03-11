import { supabase } from '../lib/supabaseClient';
import { Database } from '../../types/database.types';

type Ingredient = Database['public']['Tables']['pantry_ingredients']['Row'];
type IngredientInsert = Database['public']['Tables']['pantry_ingredients']['Insert'];
type IngredientUpdate = Database['public']['Tables']['pantry_ingredients']['Update'];

interface quantityFilter {
    operator: 'lt' | 'gt' | 'lte' | 'gte' | 'eq';
    quantity: number;
    unit: string;
}

interface IngredientFilters {
    search?: string;
    category?: string;
    flags?: string[];
    quantity?: quantityFilter;
}

export const addIngredient = async (ingredient: IngredientInsert) => {
    const { data, error } = await supabase
        .from('pantry_ingredients')
        .insert(ingredient);
    return { data, error };
};

export const deleteIngredient = async (ingredientID: number, pantryID: string) => {
    const { error } = await supabase
        .from('pantry_ingredients')
        .delete()
        .eq('ingredient_id', ingredientID)
        .eq('pantry_id', pantryID);
    return { error };
};

export const updateIngredient = async (
    ingredientId: number,
    pantryId: string,
    updates: IngredientUpdate
) => {
    const { data, error } = await supabase
        .from('pantry_ingredients')
        .update(updates)
        .eq('ingredient_id', ingredientId)
        .eq('pantry_id', pantryId);
    return { data, error };
};

export const getIngredients = async (pantryId: string, filters?: IngredientFilters) => {
    let query = supabase
        .from('pantry_ingredients')
        .select('*')
        .eq('pantry_id', pantryId);

    if (filters?.search) {
        query = query.ilike('name_normalized', `%${filters.search}%`);
    }

    if (filters?.category) {
        query = query.eq('category', filters.category);
    }

    if (filters?.flags && filters?.flags.length > 0) {
        query = query.in('flag', filters.flags);
    }

    if (filters?.quantity) {
        const {operator, quantity, unit} = filters.quantity;
        query = query.eq('unit', unit);
        switch (operator) {
            case 'lt':
                query = query.lt('quantity', quantity);
                break;
            case 'gt':
                query = query.gt('quantity', quantity);
                break;
            case 'lte':
                query = query.lte('quantity', quantity);
                break;
            case 'gte':
                query = query.gte('quantity', quantity);
                break;
            case 'eq':
                query = query.eq('quantity', quantity);
                break;
        }
    }
    const {data, error} = await query;
    return {data, error};
};
