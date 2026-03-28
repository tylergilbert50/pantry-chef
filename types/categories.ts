export const CATEGORIES = [
  "Fruit",
  "Vegetable",
  "Meat",
  "Dairy",
  "Canned",
  "Dry",
] as const;

export type Category = (typeof CATEGORIES)[number];
