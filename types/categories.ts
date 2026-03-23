export const CATEGORIES = [
  "Alcohol",
  "Bakery",
  "Beverages",
  "Bread",
  "Canned Goods",
  "Cheese",
  "Condiments",
  "Dairy",
  "Dry Goods",
  "Eggs",
  "Frozen",
  "Health Foods",
  "International",
  "Meat",
  "Pasta",
  "Produce",
  "Rice",
  "Seafood",
  "Snacks",
  "Spices",
] as const;

export type Category = (typeof CATEGORIES)[number];
