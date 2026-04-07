// this file should receive input as JSON from the ingredient information confirmation form and
// handle formatting of the data before using the addIngredient or updateIngredient functions

// JSON should be identifiable as insert or update

// Fields (I = input from form, F = fetched, C = calculated):
//   Insert:
//     Required:
//      amount_grams (C from I) , category (F or I for override) , display_unit (I), grams_per_each (F),
//      name_normalized (I or alternatively F by handling name_product with spoonacular),
//      name_product (I), pantry_id (F), spoonacular_id (F)

//     Optional:
//      expiration_date (I) , image (F or I) , in_stock (C), low_stock_threshold_grams (F)

//   Update (requires ingredient_id):
//      amount_grams (C from I) , category (I) , display_unit (I), name_normalized (I)
//      expiration_date (I) , image (I), low_stock_threshold_grams (I)

