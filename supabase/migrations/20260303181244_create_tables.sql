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
    ingredient_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pantry_id UUID NOT NULL REFERENCES pantries(pantry_id),
    spoonacular_id TEXT NOT NULL,
    name_normalized TEXT NOT NULL,
    name_product TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity DECIMAL,
    unit TEXT NOT NULL,
    low_stock_threshold DECIMAL,
    in_stock BOOLEAN GENERATED ALWAYS AS (
        CASE
            WHEN quantity IS NOT NULL THEN quantity > low_stock_threshold
            ELSE FALSE
        END
    ) STORED,
    expiration_date DATE,
    image TEXT DEFAULT NULL
);

CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    dietary_restrictions TEXT[] DEFAULT '{}',
    calorie_target TEXT DEFAULT 'medium',
    measurement_units TEXT DEFAULT 'imperial'
);

CREATE TABLE recipes (
    recipe_id TEXT UNIQUE NOT NULL, -- pull from spoonacular
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recipe_name TEXT NOT NULL,
    saved BOOLEAN NOT NULL,
    made_on DATE,

    PRIMARY KEY (recipe_id, user_id)
);