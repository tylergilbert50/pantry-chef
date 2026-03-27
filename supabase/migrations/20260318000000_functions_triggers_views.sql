CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.create_profile_and_default_pantry(NEW);
    PERFORM public.initialize_preferences(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.create_profile_and_default_pantry(user_record RECORD)
RETURNS void AS $$
DECLARE
    new_pantry_id UUID;
BEGIN
    INSERT INTO public.pantries (pantry_name, last_updated)
    VALUES (user_record.email || '''s Pantry', CURRENT_DATE)
    RETURNING pantry_id INTO new_pantry_id;

    INSERT INTO public.users (user_id, first_name, last_name, email, pantry_id)
    VALUES (user_record.id, '', '', user_record.email, new_pantry_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.initialize_preferences(uid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO public.user_preferences (user_id) VALUES (uid);
END;
$$ LANGUAGE plpgsql;

-- Trigger: upon insert or update to ingredients.quantity or ingredients.weight_grams, automatically recalculate the other field to match using the grams_per_each field
-- Trigger: Upon change to  pantry_ingredients, change pantry.last_updated to current date
-- Function: Made_recipe – deduct ingredients, update recipe entry’s made on attribute,

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();