CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_pantry_id UUID;
BEGIN
  SET LOCAL row_security = off;

  INSERT INTO public.pantries (pantry_name, last_updated)
  VALUES (NEW.email || '''s Pantry', CURRENT_DATE)
  RETURNING pantry_id INTO new_pantry_id;

  INSERT INTO public.users (user_id, first_name, last_name, email, pantry_id)
  VALUES (NEW.id, '', '', NEW.email, new_pantry_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP POLICY IF EXISTS "Users can access own pantry" ON pantries;
CREATE POLICY "Users can access own pantry"
ON pantries
FOR ALL
USING (
    pantry_id IN (
        SELECT pantry_id FROM users WHERE user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    pantry_id IN (
        SELECT pantry_id FROM users WHERE user_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can access own pantry ingredients" ON pantry_ingredients;
CREATE POLICY "Users can access own pantry ingredients"
ON pantry_ingredients
FOR ALL
USING (
    pantry_id IN (
        SELECT pantry_id FROM users WHERE user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    pantry_id IN (
        SELECT pantry_id FROM users WHERE user_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can access own user details" ON users;
CREATE POLICY "Users can access own user details"
ON users
FOR ALL
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can access own preferences" ON user_preferences;
CREATE POLICY "Users can access own preferences"
ON user_preferences
FOR ALL
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can access own recipe details" ON recipes;
CREATE POLICY "Users can access own recipe details"
ON recipes
FOR ALL
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));