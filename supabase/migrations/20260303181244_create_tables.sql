CREATE TABLE pantries (
    pantry_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pantry_name TEXT NOT NULL,
    last_updated DATE NOT NULL
);

CREATE TABLE users (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    pantry_id  UUID REFERENCES pantries(pantry_id)
);

CREATE TABLE pantry_ingredients (
    ingredient_id INT GENERATED ALWAYS AS IDENTITY,
    pantry_id UUID NOT NULL REFERENCES pantries(pantry_id),
    spoonacular_id TEXT NOT NULL,
    name_normalized TEXT NOT NULL,
    name_product TEXT NOT NULL,
    category TEXT NOT NULL,
    amount_grams INT NOT NULL,
    low_stock_threshold_grams INT,
    in_stock BOOLEAN DEFAULT TRUE,
    grams_per_each INT NOT NULL,
    display_unit TEXT NOT NULL,
    expiration_date DATE,
    image TEXT DEFAULT NULL,

    PRIMARY KEY (ingredient_id, pantry_id)
);

CREATE TABLE user_preferences (
    user_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    dietary_restrictions TEXT[] DEFAULT '{}',
    calorie_target TEXT DEFAULT 'medium',
    measurement_units TEXT DEFAULT 'imperial'
);

CREATE TABLE recipes (
    recipe_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recipe_name TEXT NOT NULL,
    saved BOOLEAN NOT NULL,
    made_on DATE,

    PRIMARY KEY (recipe_id, user_id)
);