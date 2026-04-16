## TODO

- [ ] Audit full project for drift after schema changes (services, types, screens, handlers)
- [ ] Regenerate database.types.ts after migration
- [ ] Design and implement categories table (measurement_type, default_low_stock_threshold)
- [ ] Update set_default_threshold trigger — fix column name to low_stock_threshold, look up from categories table
- [ ] Set real default_low_stock_threshold values per category (currently all 0)
- [ ] Expand UNITS in types/units.ts (missing gal, each, g, kg, etc.)
- [ ] Delete the accidental `...` file from repo
- [ ] Update ingredientSubmitHandler field notes for dual-field model (quantity vs amount_grams)
