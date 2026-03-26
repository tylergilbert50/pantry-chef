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
    name_normalized TEXT NOT NULL,
    name_product TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INT NOT NULL,
    unit TEXT NOT NULL,
    expiration_date DATE,
    flag TEXT,

    PRIMARY KEY (ingredient_id, pantry_id)
);

CREATE TABLE user_preferences (
    user_id uuid PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    dietary_restrictions text DEFAULT 'none',
    ...add more
);

CREATE TABLE recipes (
    recipe_id INT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id),
    recipe_name TEXT NOT NULL,
    saved BOOLEAN NOT NULL,
    made_on DATE,

    PRIMARY KEY (recipe_id, user_id)
);