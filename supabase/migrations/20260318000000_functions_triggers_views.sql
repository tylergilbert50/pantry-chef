CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.create_profile_and_set_defaults(NEW);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.create_profile_and_set_defaults(user_record RECORD)
RETURNS void AS $$
DECLARE
    new_pantry_id UUID;
BEGIN
    INSERT INTO public.pantries (pantry_name, last_updated)
    VALUES (user_record.email || '''s Pantry', CURRENT_DATE)
    RETURNING pantry_id INTO new_pantry_id;

    INSERT INTO public.users (user_id, first_name, last_name, email, pantry_id)
    VALUES (user_record.id, '', '', user_record.email, new_pantry_id);

    INSERT INTO public.user_preferences (user_id, dietary_restrictions, calorie_target, measurement_units)
    VALUES (user_record.id, '{}', 'none', 'imperial');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
EXECUTE FUNCTION public.handle_new_user();

-----------------------------------------------------------

-- Trigger: Sets the threshold value the system uses to determine whether an ingredient is low/out-of-stock
CREATE OR REPLACE FUNCTION public.set_default_threshold()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.low_threshold_grams IS NULL THEN
    NEW.low_threshold_grams := CASE NEW.category
     -- fixme: default values of zero need to be set to reasonable thresholds
      WHEN 'Produce' THEN 0
      WHEN 'Meat' THEN 0
      WHEN 'Liquid' THEN 0
      WHEN 'Canned' THEN 0
      WHEN 'Dry' THEN 0
      ELSE 0
END;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ingredient_threshold
BEFORE INSERT ON public.pantry_ingredients
FOR EACH ROW EXECUTE FUNCTION public.set_default_threshold();

-----------------------------------------------------------

-- Trigger: After modification to pantry, update the last_updated:Date attribute
CREATE OR REPLACE FUNCTION public.update_pantry_last_updated()
RETURNS TRIGGER AS $$
BEGIN
UPDATE pantries
SET last_updated = CURRENT_DATE
WHERE pantry_id = COALESCE(NEW.pantry_id, OLD.pantry_id);
RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_pantry_last_updated
AFTER INSERT OR UPDATE OR DELETE ON pantry_ingredients
FOR EACH ROW EXECUTE FUNCTION public.update_pantry_last_updated();

-----------------------------------------------------------

-- Trigger: upon insert or update to ingredients.quantity or ingredients.weight_grams, automatically recalculate the other field to match using the grams_per_each field
