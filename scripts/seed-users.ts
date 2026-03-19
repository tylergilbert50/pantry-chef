console.log('starting seed...');

import { config } from 'dotenv';
config({ path: '.env.local' });
config();
import { createClient } from '@supabase/supabase-js';


// Admin client with service_role key to bypass RLS
const admin = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Anon client for testing sign-in at the end
const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserSeed {
    email: string;
    first_name: string;
    last_name: string;
    pantry_id: string;
    preferences: { name: string; state: boolean }[];
    recipes: { recipe_id: number; recipe_name: string; saved: boolean; made_on: string | null }[];
}

const userSeeds: UserSeed[] = [
    {
        email: 'ashton@example.com',
        first_name: 'Ashton',
        last_name: 'Reid',
        pantry_id: 'd4444444-4444-4444-4444-444444444444',
        preferences: [
            { name: 'vegetarian',  state: false },
            { name: 'gluten_free', state: false },
            { name: 'dairy_free',  state: false },
            { name: 'nut_free',    state: false },
        ],
        recipes: [
            { recipe_id: 1001, recipe_name: 'Chicken Stir Fry',     saved: true,  made_on: '2026-03-10' },
            { recipe_id: 1002, recipe_name: 'Garlic Butter Pasta',  saved: true,  made_on: null },
            { recipe_id: 1003, recipe_name: 'Cheesy Broccoli Rice', saved: false, made_on: '2026-03-15' },
        ],
    },
    {
        email: 'tyler@example.com',
        first_name: 'Tyler',
        last_name: 'Brooks',
        pantry_id: 'e5555555-5555-5555-5555-555555555555',
        preferences: [
            { name: 'vegetarian',  state: true },
            { name: 'gluten_free', state: false },
            { name: 'dairy_free',  state: false },
            { name: 'nut_free',    state: true },
        ],
        recipes: [
            { recipe_id: 2001, recipe_name: 'Spinach & Lemon Salad', saved: true, made_on: '2026-03-05' },
            { recipe_id: 2002, recipe_name: 'Avocado Toast',         saved: true, made_on: '2026-03-18' },
        ],
    },
    {
        email: 'jordan@example.com',
        first_name: 'Jordan',
        last_name: 'Lee',
        pantry_id: 'e5555555-5555-5555-5555-555555555555',
        preferences: [
            { name: 'vegetarian',  state: false },
            { name: 'gluten_free', state: true },
            { name: 'dairy_free',  state: false },
            { name: 'nut_free',    state: false },
        ],
        recipes: [
            { recipe_id: 3001, recipe_name: 'Pan-Seared Salmon',    saved: true,  made_on: '2026-03-12' },
            { recipe_id: 3002, recipe_name: 'Tomato Butter Salmon', saved: false, made_on: null },
        ],
    },
];

async function seed() {
    for (const u of userSeeds) {
        // Create user via admin API
        const { data: authData, error: authError } = await admin.auth.admin.createUser({
            email: u.email,
            password: 'password123',
            email_confirm: true,
        });

        if (authError || !authData.user) {
            console.log(`${u.email} signup ERROR: ${authError?.message}`);
            continue;
        }

        const userId = authData.user.id;
        console.log(`${u.email} created (${userId})`);

        // All inserts use admin client, bypass RLS
        const { error: profileErr } = await admin.from('users').insert({
            user_id: userId,
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.email,
            pantry_id: u.pantry_id,
        });
        console.log(`  profile: ${profileErr ? 'ERROR: ' + profileErr.message : 'OK'}`);

        for (const pref of u.preferences) {
            const { error: prefErr } = await admin.from('user_preferences').insert({
                user_id: userId,
                preference_name: pref.name,
                preference_state: pref.state,
            });
            if (prefErr) console.log(`  pref ${pref.name} ERROR: ${prefErr.message}`);
        }
        console.log(`  preferences: OK`);

        for (const recipe of u.recipes) {
            const { error: recErr } = await admin.from('recipes').insert({
                recipe_id: recipe.recipe_id,
                user_id: userId,
                recipe_name: recipe.recipe_name,
                saved: recipe.saved,
                made_on: recipe.made_on,
            });
            if (recErr) console.log(`  recipe ${recipe.recipe_name} ERROR: ${recErr.message}`);
        }
        console.log(`  recipes: OK`);
    }

    // Test sign-in with anon client to verify auth works
    const { error: testErr } = await supabase.auth.signInWithPassword({
        email: 'ashton@example.com',
        password: 'password123',
    });
    console.log(`\ntest signin: ${testErr ? 'ERROR: ' + testErr.message : 'OK'}`);
    console.log('All users password: password123');
}

seed().catch(e => console.error('FATAL:', e));
