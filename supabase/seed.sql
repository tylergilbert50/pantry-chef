DELETE FROM auth.users;

-- Pantries
INSERT INTO pantries (pantry_id, pantry_name, last_updated)
VALUES
    ('d4444444-4444-4444-4444-444444444444', 'Ashton''s Pantry',        CURRENT_DATE),
    ('e5555555-5555-5555-5555-555555555555', 'Tyler & Jordan''s Place', CURRENT_DATE - INTERVAL '2 days');

-- Ashton's pantry ingredients
INSERT INTO pantry_ingredients (pantry_id, name_normalized, name_product, category, quantity, unit, expiration_date, flag)
VALUES
    ('d4444444-4444-4444-4444-444444444444', 'chicken breast', 'Tyson Chicken Breast',   'Protein',   2,  'lb',     CURRENT_DATE + INTERVAL '5 days',   NULL),
    ('d4444444-4444-4444-4444-444444444444', 'rice',           'Jasmine Rice',           'Grain',     3,  'cup',    CURRENT_DATE + INTERVAL '90 days',  NULL),
    ('d4444444-4444-4444-4444-444444444444', 'broccoli',       'Fresh Broccoli Crowns',  'Vegetable', 1,  'bunch',  CURRENT_DATE + INTERVAL '4 days',   NULL),
    ('d4444444-4444-4444-4444-444444444444', 'soy sauce',      'Kikkoman Soy Sauce',     'Condiment', 1,  'bottle', CURRENT_DATE + INTERVAL '365 days', NULL),
    ('d4444444-4444-4444-4444-444444444444', 'eggs',           'Large Grade A Eggs',     'Dairy',     12, 'count',  CURRENT_DATE + INTERVAL '14 days',  NULL),
    ('d4444444-4444-4444-4444-444444444444', 'milk',           'Whole Milk',             'Dairy',     1,  'gallon', CURRENT_DATE + INTERVAL '7 days',   NULL),
    ('d4444444-4444-4444-4444-444444444444', 'garlic',         'Fresh Garlic',           'Vegetable', 5,  'clove',  CURRENT_DATE + INTERVAL '21 days',  NULL),
    ('d4444444-4444-4444-4444-444444444444', 'olive oil',      'Extra Virgin Olive Oil', 'Oil',       1,  'bottle', CURRENT_DATE + INTERVAL '180 days', NULL),
    ('d4444444-4444-4444-4444-444444444444', 'cheddar cheese', 'Sharp Cheddar Block',    'Dairy',     8,  'oz',     CURRENT_DATE + INTERVAL '30 days',  NULL),
    ('d4444444-4444-4444-4444-444444444444', 'pasta',          'Barilla Penne',          'Grain',     1,  'box',    CURRENT_DATE + INTERVAL '365 days', NULL),
    ('d4444444-4444-4444-4444-444444444444', 'ground beef',    '80/20 Ground Beef',      'Protein',   1,  'lb',     CURRENT_DATE - INTERVAL '1 day',    'expired');

-- Tyler & Jordan's pantry ingredients
INSERT INTO pantry_ingredients (pantry_id, name_normalized, name_product, category, quantity, unit, expiration_date, flag)
VALUES
    ('e5555555-5555-5555-5555-555555555555', 'salmon',  'Atlantic Salmon Fillet', 'Protein',   1, 'lb',    CURRENT_DATE + INTERVAL '3 days',   NULL),
    ('e5555555-5555-5555-5555-555555555555', 'spinach', 'Baby Spinach',          'Vegetable', 1, 'bag',   CURRENT_DATE + INTERVAL '5 days',   NULL),
    ('e5555555-5555-5555-5555-555555555555', 'lemon',   'Fresh Lemons',          'Fruit',     3, 'count', CURRENT_DATE + INTERVAL '10 days',  NULL),
    ('e5555555-5555-5555-5555-555555555555', 'butter',  'Unsalted Butter',       'Dairy',     1, 'stick', CURRENT_DATE + INTERVAL '30 days',  NULL),
    ('e5555555-5555-5555-5555-555555555555', 'flour',   'All-Purpose Flour',     'Grain',     5, 'cup',   CURRENT_DATE + INTERVAL '180 days', NULL),
    ('e5555555-5555-5555-5555-555555555555', 'tomato',  'Roma Tomatoes',         'Vegetable', 4, 'count', CURRENT_DATE + INTERVAL '6 days',   NULL),
    ('e5555555-5555-5555-5555-555555555555', 'avocado', 'Hass Avocado',          'Fruit',     2, 'count', CURRENT_DATE + INTERVAL '2 days',   'expiring_soon');