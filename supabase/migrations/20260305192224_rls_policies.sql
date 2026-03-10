ALTER TABLE pantries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE
POLICY "Users can access own pantry"
ON pantries
FOR ALL
USING( pantry_id IN (
        SELECT pantry_id FROM users WHERE user_id = (SELECT auth.uid())
    )
);

CREATE
POLICY "Users can access own user details"
ON users
FOR ALL
USING(user_id = (SELECT auth.uid()));

CREATE
POLICY "Users can access own pantry ingredients"
ON pantry_ingredients
FOR ALL
    USING (pantry_id IN (
        SELECT pantry_id FROM users WHERE user_id = (SELECT auth.uid())
    )
);

CREATE
POLICY "Users can access own preferences"
ON user_preferences
FOR ALL
USING(user_id = (SELECT auth.uid()));

CREATE
POLICY "Users can access own recipe details"
ON recipes
FOR ALL
USING(user_id = (SELECT auth.uid()));
