-- ============================================
-- Pantry Chef Seed Data
-- Drop into supabase/seed.sql
-- Runs automatically after: supabase db reset
-- ============================================

-- 1. Insert into auth.users (Supabase auth schema)
--    These UUIDs will be referenced throughout
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role, encrypted_password, email_confirmed_at, confirmation_sent_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'ashton@example.com',  '{"full_name": "Ashton Reid"}',  now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', crypt('password123', gen_salt('bf')), now(), now()),
  ('b2222222-2222-2222-2222-222222222222', 'tyler@example.com',   '{"full_name": "Tyler Brooks"}',  now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', crypt('password123', gen_salt('bf')), now(), now()),
  ('c3333333-3333-3333-3333-333333333333', 'jordan@example.com',  '{"full_name": "Jordan Lee"}',    now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', crypt('password123', gen_salt('bf')), now(), now());

-- 2. Pantries
INSERT INTO pantries (pantry_id, pantry_name, last_updated)
VALUES
  ('d4444444-4444-4444-4444-444444444444', 'Ashton''s Pantry',       CURRENT_DATE),
  ('e5555555-5555-5555-5555-555555555555', 'Tyler & Jordan''s Place', CURRENT_DATE - INTERVAL '2 days');

-- 3. Users (linked to auth.users and pantries)
INSERT INTO users (user_id, first_name, last_name, email, pantry_id)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Ashton',  'Reid',   'ashton@example.com',  'd4444444-4444-4444-4444-444444444444'),
  ('b2222222-2222-2222-2222-222222222222', 'Tyler',   'Brooks', 'tyler@example.com',   'e5555555-5555-5555-5555-555555555555'),
  ('c3333333-3333-3333-3333-333333333333', 'Jordan',  'Lee',    'jordan@example.com',  'e5555555-5555-5555-5555-555555555555');

-- 4. Pantry Ingredients
--    Ashton's pantry - stocked up
INSERT INTO pantry_ingredients (pantry_id, name_normalized, name_product, category, quantity, unit, expiration_date, flag)
VALUES
  ('d4444444-4444-4444-4444-444444444444', 'chicken breast',   'Tyson Chicken Breast',        'Protein',    2, 'lb',    CURRENT_DATE + INTERVAL '5 days',  NULL),
  ('d4444444-4444-4444-4444-444444444444', 'rice',             'Jasmine Rice',                'Grain',      3, 'cup',   CURRENT_DATE + INTERVAL '90 days', NULL),
  ('d4444444-4444-4444-4444-444444444444', 'broccoli',         'Fresh Broccoli Crowns',       'Vegetable',  1, 'bunch', CURRENT_DATE + INTERVAL '4 days',  NULL),
  ('d4444444-4444-4444-4444-444444444444', 'soy sauce',        'Kikkoman Soy Sauce',          'Condiment',  1, 'bottle',CURRENT_DATE + INTERVAL '365 days',NULL),
  ('d4444444-4444-4444-4444-444444444444', 'eggs',             'Large Grade A Eggs',          'Dairy',     12, 'count', CURRENT_DATE + INTERVAL '14 days', NULL),
  ('d4444444-4444-4444-4444-444444444444', 'milk',             'Whole Milk',                  'Dairy',      1, 'gallon',CURRENT_DATE + INTERVAL '7 days',  NULL),
  ('d4444444-4444-4444-4444-444444444444', 'garlic',           'Fresh Garlic',                'Vegetable',  5, 'clove', CURRENT_DATE + INTERVAL '21 days', NULL),
  ('d4444444-4444-4444-4444-444444444444', 'olive oil',        'Extra Virgin Olive Oil',      'Oil',        1, 'bottle',CURRENT_DATE + INTERVAL '180 days',NULL),
  ('d4444444-4444-4444-4444-444444444444', 'cheddar cheese',   'Sharp Cheddar Block',         'Dairy',      8, 'oz',    CURRENT_DATE + INTERVAL '30 days', NULL),
  ('d4444444-4444-4444-4444-444444444444', 'pasta',            'Barilla Penne',               'Grain',      1, 'box',   CURRENT_DATE + INTERVAL '365 days',NULL),
  ('d4444444-4444-4444-4444-444444444444', 'ground beef',      '80/20 Ground Beef',           'Protein',    1, 'lb',    CURRENT_DATE - INTERVAL '1 day',   'expired');

--    Tyler & Jordan's pantry
INSERT INTO pantry_ingredients (pantry_id, name_normalized, name_product, category, quantity, unit, expiration_date, flag)
VALUES
  ('e5555555-5555-5555-5555-555555555555', 'salmon',           'Atlantic Salmon Fillet',      'Protein',    1, 'lb',    CURRENT_DATE + INTERVAL '3 days',  NULL),
  ('e5555555-5555-5555-5555-555555555555', 'spinach',          'Baby Spinach',                'Vegetable',  1, 'bag',   CURRENT_DATE + INTERVAL '5 days',  NULL),
  ('e5555555-5555-5555-5555-555555555555', 'lemon',            'Fresh Lemons',                'Fruit',      3, 'count', CURRENT_DATE + INTERVAL '10 days', NULL),
  ('e5555555-5555-5555-5555-555555555555', 'butter',           'Unsalted Butter',             'Dairy',      1, 'stick', CURRENT_DATE + INTERVAL '30 days', NULL),
  ('e5555555-5555-5555-5555-555555555555', 'flour',            'All-Purpose Flour',           'Grain',      5, 'cup',   CURRENT_DATE + INTERVAL '180 days',NULL),
  ('e5555555-5555-5555-5555-555555555555', 'tomato',           'Roma Tomatoes',               'Vegetable',  4, 'count', CURRENT_DATE + INTERVAL '6 days',  NULL),
  ('e5555555-5555-5555-5555-555555555555', 'avocado',          'Hass Avocado',                'Fruit',      2, 'count', CURRENT_DATE + INTERVAL '2 days',  'expiring_soon');

-- 5. User Preferences
INSERT INTO user_preferences (user_id, preference_name, preference_state)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'vegetarian',    false),
  ('a1111111-1111-1111-1111-111111111111', 'gluten_free',   false),
  ('a1111111-1111-1111-1111-111111111111', 'dairy_free',    false),
  ('a1111111-1111-1111-1111-111111111111', 'nut_free',      false),
  ('b2222222-2222-2222-2222-222222222222', 'vegetarian',    true),
  ('b2222222-2222-2222-2222-222222222222', 'gluten_free',   false),
  ('b2222222-2222-2222-2222-222222222222', 'dairy_free',    false),
  ('b2222222-2222-2222-2222-222222222222', 'nut_free',      true),
  ('c3333333-3333-3333-3333-333333333333', 'vegetarian',    false),
  ('c3333333-3333-3333-3333-333333333333', 'gluten_free',   true),
  ('c3333333-3333-3333-3333-333333333333', 'dairy_free',    false),
  ('c3333333-3333-3333-3333-333333333333', 'nut_free',      false);

-- 6. Recipes (saved/made history)
INSERT INTO recipes (recipe_id, user_id, recipe_name, saved, made_on)
VALUES
  (1001, 'a1111111-1111-1111-1111-111111111111', 'Chicken Stir Fry',           true,  CURRENT_DATE - INTERVAL '3 days'),
  (1002, 'a1111111-1111-1111-1111-111111111111', 'Garlic Butter Pasta',        true,  NULL),
  (1003, 'a1111111-1111-1111-1111-111111111111', 'Cheesy Broccoli Rice',       false, CURRENT_DATE - INTERVAL '1 day'),
  (2001, 'b2222222-2222-2222-2222-222222222222', 'Spinach & Lemon Salad',      true,  CURRENT_DATE - INTERVAL '5 days'),
  (2002, 'b2222222-2222-2222-2222-222222222222', 'Avocado Toast',              true,  CURRENT_DATE),
  (3001, 'c3333333-3333-3333-3333-333333333333', 'Pan-Seared Salmon',          true,  CURRENT_DATE - INTERVAL '2 days'),
  (3002, 'c3333333-3333-3333-3333-333333333333', 'Tomato Butter Salmon',       false, NULL);
