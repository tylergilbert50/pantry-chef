// All units normalized to a base unit per category
// Volume base: ml, Weight base: g, Count base: each

const toBase: Record<string, { base: "ml" | "g" | "each"; factor: number }> = {
  // Volume
  ml:         { base: "ml", factor: 1 },
  milliliter: { base: "ml", factor: 1 },
  millilitre: { base: "ml", factor: 1 },
  l:          { base: "ml", factor: 1000 },
  liter:      { base: "ml", factor: 1000 },
  litre:      { base: "ml", factor: 1000 },
  tsp:        { base: "ml", factor: 4.929 },
  teaspoon:   { base: "ml", factor: 4.929 },
  teaspoons:  { base: "ml", factor: 4.929 },
  tbsp:       { base: "ml", factor: 14.787 },
  tablespoon: { base: "ml", factor: 14.787 },
  tablespoons:{ base: "ml", factor: 14.787 },
  "fl oz":    { base: "ml", factor: 29.574 },
  "fluid ounce": { base: "ml", factor: 29.574 },
  cup:        { base: "ml", factor: 236.588 },
  cups:       { base: "ml", factor: 236.588 },
  pint:       { base: "ml", factor: 473.176 },
  pints:      { base: "ml", factor: 473.176 },
  quart:      { base: "ml", factor: 946.353 },
  quarts:     { base: "ml", factor: 946.353 },
  gallon:     { base: "ml", factor: 3785.41 },
  gallons:    { base: "ml", factor: 3785.41 },

  // Weight
  g:          { base: "g", factor: 1 },
  gram:       { base: "g", factor: 1 },
  grams:      { base: "g", factor: 1 },
  kg:         { base: "g", factor: 1000 },
  kilogram:   { base: "g", factor: 1000 },
  kilograms:  { base: "g", factor: 1000 },
  oz:         { base: "g", factor: 28.3495 },
  ounce:      { base: "g", factor: 28.3495 },
  ounces:     { base: "g", factor: 28.3495 },
  lb:         { base: "g", factor: 453.592 },
  lbs:        { base: "g", factor: 453.592 },
  pound:      { base: "g", factor: 453.592 },
  pounds:     { base: "g", factor: 453.592 },

  // Count
  each:       { base: "each", factor: 1 },
  "":         { base: "each", factor: 1 },
};

type Measurement = { quantity: number; unit: string };

/**
 * Takes a current measurement and a deduction measurement,
 * converts the deduction into the original unit, and returns the remainder.
 * Returns null if the units are incompatible (e.g. weight vs volume).
 */
export function convert(before: Measurement, deduct: Measurement): number | null {
  const beforeKey = before.unit.toLowerCase().trim();
  const deductKey = deduct.unit.toLowerCase().trim();

  // Same unit, just subtract
  if (beforeKey === deductKey) {
    return before.quantity - deduct.quantity;
  }

  const b = toBase[beforeKey];
  const d = toBase[deductKey];

  if (!b || !d) return null;
  if (b.base !== d.base) return null;

  const deductInBase = deduct.quantity * d.factor;
  const deductInOriginal = deductInBase / b.factor;

  return before.quantity - deductInOriginal;
}
