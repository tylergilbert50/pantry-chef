import { getDensity, Density } from "./densities";

// All units normalized to a base unit per category.
// Volume base: ml, Mass base: g, Count base: each

type BaseUnit = "ml" | "g" | "each";

const toBase: Record<string, { base: BaseUnit; factor: number }> = {
  // Volume
  ml: { base: "ml", factor: 1 },
  milliliter: { base: "ml", factor: 1 },
  millilitre: { base: "ml", factor: 1 },
  milliliters: { base: "ml", factor: 1 },
  millilitres: { base: "ml", factor: 1 },
  l: { base: "ml", factor: 1000 },
  liter: { base: "ml", factor: 1000 },
  litre: { base: "ml", factor: 1000 },
  liters: { base: "ml", factor: 1000 },
  litres: { base: "ml", factor: 1000 },
  tsp: { base: "ml", factor: 4.929 },
  teaspoon: { base: "ml", factor: 4.929 },
  teaspoons: { base: "ml", factor: 4.929 },
  tbsp: { base: "ml", factor: 14.787 },
  tablespoon: { base: "ml", factor: 14.787 },
  tablespoons: { base: "ml", factor: 14.787 },
  "fl oz": { base: "ml", factor: 29.574 },
  "fluid ounce": { base: "ml", factor: 29.574 },
  "fluid ounces": { base: "ml", factor: 29.574 },
  cup: { base: "ml", factor: 236.588 },
  cups: { base: "ml", factor: 236.588 },
  pint: { base: "ml", factor: 473.176 },
  pints: { base: "ml", factor: 473.176 },
  quart: { base: "ml", factor: 946.353 },
  quarts: { base: "ml", factor: 946.353 },
  gallon: { base: "ml", factor: 3785.41 },
  gallons: { base: "ml", factor: 3785.41 },

  // Mass
  g: { base: "g", factor: 1 },
  gram: { base: "g", factor: 1 },
  grams: { base: "g", factor: 1 },
  kg: { base: "g", factor: 1000 },
  kilogram: { base: "g", factor: 1000 },
  kilograms: { base: "g", factor: 1000 },
  oz: { base: "g", factor: 28.3495 },
  ounce: { base: "g", factor: 28.3495 },
  ounces: { base: "g", factor: 28.3495 },
  lb: { base: "g", factor: 453.592 },
  lbs: { base: "g", factor: 453.592 },
  pound: { base: "g", factor: 453.592 },
  pounds: { base: "g", factor: 453.592 },

  // Count
  each: { base: "each", factor: 1 },
  ea: { base: "each", factor: 1 },
  unit: { base: "each", factor: 1 },
  units: { base: "each", factor: 1 },
  piece: { base: "each", factor: 1 },
  pieces: { base: "each", factor: 1 },
  whole: { base: "each", factor: 1 },
  "": { base: "each", factor: 1 },
};

export type Measurement = { quantity: number; unit: string };

export type ConversionResult =
  | { ok: true; quantity: number }
  | { ok: false; reason: "unknown-unit" | "incompatible-no-density" };

function lookupUnit(unit: string) {
  return toBase[unit.toLowerCase().trim()];
}

/**
 * Convert a quantity from one unit to another.
 * When the source and target are in different dimensions (e.g. ml -> g),
 * a density for the ingredient is required. Returns a tagged result so
 * callers can distinguish "impossible" from "unknown unit".
 */
export function convertAmount(
  quantity: number,
  fromUnit: string,
  toUnit: string,
  density?: Density | null,
): ConversionResult {
  const from = lookupUnit(fromUnit);
  const to = lookupUnit(toUnit);

  if (!from || !to) return { ok: false, reason: "unknown-unit" };

  // Same dimension: straightforward factor conversion
  if (from.base === to.base) {
    const inBase = quantity * from.factor;
    return { ok: true, quantity: inBase / to.factor };
  }

  // Cross-dimension: need density
  if (!density) return { ok: false, reason: "incompatible-no-density" };

  // Normalize the source quantity to its base unit
  const inFromBase = quantity * from.factor;

  // Pivot through grams (our canonical mass unit)
  let grams: number;
  if (from.base === "g") {
    grams = inFromBase;
  } else if (from.base === "ml") {
    if (density.gramsPerMl == null) {
      return { ok: false, reason: "incompatible-no-density" };
    }
    grams = inFromBase * density.gramsPerMl;
  } else {
    // from.base === "each"
    if (density.gramsPerEach == null) {
      return { ok: false, reason: "incompatible-no-density" };
    }
    grams = inFromBase * density.gramsPerEach;
  }

  // Convert grams to the target base
  let inToBase: number;
  if (to.base === "g") {
    inToBase = grams;
  } else if (to.base === "ml") {
    if (density.gramsPerMl == null) {
      return { ok: false, reason: "incompatible-no-density" };
    }
    inToBase = grams / density.gramsPerMl;
  } else {
    // to.base === "each"
    if (density.gramsPerEach == null) {
      return { ok: false, reason: "incompatible-no-density" };
    }
    inToBase = grams / density.gramsPerEach;
  }

  return { ok: true, quantity: inToBase / to.factor };
}

/**
 * Takes a current measurement and a deduction measurement,
 * converts the deduction into the original unit, and returns the remainder.
 * Returns null if the units are incompatible and no density is available.
 *
 * Pass `ingredientName` to enable cross-dimension deduction (e.g. deducting
 * 2 tbsp peanut butter from a pantry stored in ounces).
 */
export function convert(
  before: Measurement,
  deduct: Measurement,
  ingredientName?: string,
): number | null {
  const density = ingredientName ? getDensity(ingredientName) : null;
  const result = convertAmount(
    deduct.quantity,
    deduct.unit,
    before.unit,
    density,
  );
  if (!result.ok) return null;
  return before.quantity - result.quantity;
}
