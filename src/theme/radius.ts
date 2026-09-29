// Matches the tailwind.config borderRadius overrides embedded in every Stitch screen export.
export const radius = {
  sm: 2, // tailwind default, not overridden by Stitch config
  DEFAULT: 4,
  md: 6, // tailwind default, not overridden by Stitch config
  lg: 8,
  xl: 12,
  pill: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
