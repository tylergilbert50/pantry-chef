// Units the user can log pantry ingredients in.
// Cups are intentionally excluded — they're ambiguous for pantry storage
// (a cup of flour vs a cup of nuts weighs very differently), but the
// conversion layer still accepts cups as an input unit from recipes.

export const MASS_UNITS = ["g", "kg", "oz", "lb"] as const;
export const VOLUME_UNITS = ["ml", "l", "tsp", "tbsp"] as const;
export const COUNT_UNITS = ["each"] as const;

export const UNITS = [...MASS_UNITS, ...VOLUME_UNITS, ...COUNT_UNITS] as const;

export type MassUnit = (typeof MASS_UNITS)[number];
export type VolumeUnit = (typeof VOLUME_UNITS)[number];
export type CountUnit = (typeof COUNT_UNITS)[number];
export type Unit = (typeof UNITS)[number];
