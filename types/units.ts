export const UNITS = ["oz", "lb", "count"] as const;

export type Unit = (typeof UNITS)[number];
