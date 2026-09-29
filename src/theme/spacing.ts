// 1rem = 16px, matching the Stitch tailwind spacing scale.
export const spacing = {
  space2xs: 2,
  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 16,
  spaceLg: 24,
  spaceXl: 32,
  space2xl: 48,

  gutterSm: 12,
  gutter: 16,
  gutterLg: 24,

  marginSm: 16,
  margin: 20,
  marginLg: 32,
} as const;

export type SpacingToken = keyof typeof spacing;
