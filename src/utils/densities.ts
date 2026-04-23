// Density data for ingredients, used to convert between mass and volume
// (or count and mass) when a recipe's unit doesn't match the pantry's unit.
//
// - gramsPerMl: how much 1 ml of the ingredient weighs, in grams
// - gramsPerEach: how much one "each" of the ingredient weighs, in grams
//                 (for countable items like eggs, lemons, garlic cloves)
//
// Lookup is by normalized ingredient name (lowercase, stripped of punctuation).
// If a name isn't in this table, cross-dimension conversion is impossible
// and the caller should fall back to lenient behavior.

export type Density = {
  gramsPerMl?: number;
  gramsPerEach?: number;
};

// Values sourced from standard cooking references (USDA, King Arthur, etc.)
// Keys must match the output of normalizeIngredientName().
const DENSITY_TABLE: Record<string, Density> = {
  // Liquids — close to water
  water: { gramsPerMl: 1.0 },
  milk: { gramsPerMl: 1.03 },
  "whole milk": { gramsPerMl: 1.03 },
  "skim milk": { gramsPerMl: 1.035 },
  cream: { gramsPerMl: 1.0 },
  "heavy cream": { gramsPerMl: 0.994 },
  "heavy whipping cream": { gramsPerMl: 0.994 },
  "sour cream": { gramsPerMl: 0.96 },
  yogurt: { gramsPerMl: 1.03 },
  "greek yogurt": { gramsPerMl: 1.05 },
  buttermilk: { gramsPerMl: 1.03 },

  // Oils & fats
  "olive oil": { gramsPerMl: 0.915 },
  "vegetable oil": { gramsPerMl: 0.92 },
  "canola oil": { gramsPerMl: 0.915 },
  "coconut oil": { gramsPerMl: 0.92 },
  "sesame oil": { gramsPerMl: 0.92 },
  butter: { gramsPerMl: 0.911, gramsPerEach: 113 }, // "each" = 1 stick
  "unsalted butter": { gramsPerMl: 0.911, gramsPerEach: 113 },
  "salted butter": { gramsPerMl: 0.911, gramsPerEach: 113 },

  // Sweeteners
  sugar: { gramsPerMl: 0.845 },
  "granulated sugar": { gramsPerMl: 0.845 },
  "white sugar": { gramsPerMl: 0.845 },
  "brown sugar": { gramsPerMl: 0.93 }, // packed
  "powdered sugar": { gramsPerMl: 0.56 },
  "confectioners sugar": { gramsPerMl: 0.56 },
  honey: { gramsPerMl: 1.42 },
  "maple syrup": { gramsPerMl: 1.33 },
  molasses: { gramsPerMl: 1.4 },

  // Flours & dry baking goods
  flour: { gramsPerMl: 0.53 },
  "all purpose flour": { gramsPerMl: 0.53 },
  "all-purpose flour": { gramsPerMl: 0.53 },
  "bread flour": { gramsPerMl: 0.54 },
  "cake flour": { gramsPerMl: 0.47 },
  "whole wheat flour": { gramsPerMl: 0.51 },
  "almond flour": { gramsPerMl: 0.406 },
  cornstarch: { gramsPerMl: 0.54 },
  "baking powder": { gramsPerMl: 0.92 },
  "baking soda": { gramsPerMl: 0.94 },
  yeast: { gramsPerMl: 0.8 },
  "cocoa powder": { gramsPerMl: 0.51 },

  // Grains & starches
  rice: { gramsPerMl: 0.78 },
  "white rice": { gramsPerMl: 0.78 },
  "brown rice": { gramsPerMl: 0.76 },
  oats: { gramsPerMl: 0.41 },
  "rolled oats": { gramsPerMl: 0.41 },
  quinoa: { gramsPerMl: 0.72 },

  // Salt & spices (approximate — spices vary a lot)
  salt: { gramsPerMl: 1.2 },
  "table salt": { gramsPerMl: 1.2 },
  "kosher salt": { gramsPerMl: 0.72 },
  "sea salt": { gramsPerMl: 1.2 },
  pepper: { gramsPerMl: 0.5 },
  "black pepper": { gramsPerMl: 0.5 },
  cinnamon: { gramsPerMl: 0.52 },
  "ground cinnamon": { gramsPerMl: 0.52 },
  paprika: { gramsPerMl: 0.46 },
  cumin: { gramsPerMl: 0.45 },
  "ground cumin": { gramsPerMl: 0.45 },

  // Nuts & nut butters
  "peanut butter": { gramsPerMl: 1.09 },
  "almond butter": { gramsPerMl: 1.04 },
  almonds: { gramsPerMl: 0.6 },
  walnuts: { gramsPerMl: 0.5 },
  peanuts: { gramsPerMl: 0.67 },

  // Condiments & sauces
  ketchup: { gramsPerMl: 1.14 },
  mustard: { gramsPerMl: 1.05 },
  mayonnaise: { gramsPerMl: 0.91 },
  "soy sauce": { gramsPerMl: 1.2 },
  "tomato sauce": { gramsPerMl: 1.04 },
  "tomato paste": { gramsPerMl: 1.08 },
  vinegar: { gramsPerMl: 1.01 },
  "apple cider vinegar": { gramsPerMl: 1.01 },
  "balsamic vinegar": { gramsPerMl: 1.12 },

  // Countable items (gramsPerEach only — these are typically sold as units)
  egg: { gramsPerEach: 50 }, // large egg
  eggs: { gramsPerEach: 50 },
  "large egg": { gramsPerEach: 50 },
  "large eggs": { gramsPerEach: 50 },
  lemon: { gramsPerEach: 58 },
  lemons: { gramsPerEach: 58 },
  lime: { gramsPerEach: 44 },
  limes: { gramsPerEach: 44 },
  orange: { gramsPerEach: 131 },
  oranges: { gramsPerEach: 131 },
  apple: { gramsPerEach: 182 },
  apples: { gramsPerEach: 182 },
  banana: { gramsPerEach: 118 },
  bananas: { gramsPerEach: 118 },
  onion: { gramsPerEach: 110 },
  onions: { gramsPerEach: 110 },
  "garlic clove": { gramsPerEach: 3 },
  "garlic cloves": { gramsPerEach: 3 },
  clove: { gramsPerEach: 3 }, // context-dependent but usually garlic in recipes
  cloves: { gramsPerEach: 3 },
  carrot: { gramsPerEach: 61 },
  carrots: { gramsPerEach: 61 },
  potato: { gramsPerEach: 213 },
  potatoes: { gramsPerEach: 213 },
  tomato: { gramsPerEach: 123 },
  tomatoes: { gramsPerEach: 123 },
};

function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Look up density info for an ingredient by name.
 * Tries the exact normalized name first, then falls back to matching
 * any word in the name against the table (so "organic peanut butter"
 * still matches "peanut butter").
 */
export function getDensity(name: string): Density | null {
  const key = normalizeKey(name);
  if (DENSITY_TABLE[key]) return DENSITY_TABLE[key];

  // Try progressively shorter suffixes — "organic peanut butter" → "peanut butter" → "butter"
  const words = key.split(" ");
  for (let i = 1; i < words.length; i++) {
    const suffix = words.slice(i).join(" ");
    if (DENSITY_TABLE[suffix]) return DENSITY_TABLE[suffix];
  }

  // Last resort: single-word match
  for (const word of words) {
    if (DENSITY_TABLE[word]) return DENSITY_TABLE[word];
  }

  return null;
}
