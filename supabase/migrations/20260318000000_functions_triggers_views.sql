-- Trigger: Automatically fills user defaults in the DB upon insert into auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
new_pantry_id UUID;
BEGIN
INSERT INTO public.pantries (pantry_name, last_updated)
VALUES (NEW.email || '''s Pantry', CURRENT_DATE)
    RETURNING pantry_id INTO new_pantry_id;

INSERT INTO public.users (user_id, first_name, last_name, email, pantry_id)
VALUES (NEW.id, '', '', NEW.email, new_pantry_id);

INSERT INTO public.user_preferences (user_id, dietary_restrictions, calorie_target, measurement_units)
VALUES (NEW.id, '{}', 'none', 'imperial');

RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_update_pantry_last_updated
AFTER INSERT OR UPDATE OR DELETE ON pantry_ingredients
FOR EACH ROW EXECUTE FUNCTION public.update_pantry_last_updated();

-----------------------------------------------------------

