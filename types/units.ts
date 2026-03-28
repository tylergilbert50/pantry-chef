export const UNITS = ["oz", "lb"] as const;

export type Unit = (typeof UNITS)[number];
