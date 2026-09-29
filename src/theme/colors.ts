// Extracted verbatim from the Stitch "Obsidian Utility" design system
// (design/stitch-export/obsidian_utility/DESIGN.md + each screen's tailwind.config).
export const colors = {
  surface: '#f8f9ff',
  surfaceDim: '#cbdbf5',
  surfaceBright: '#f8f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',
  surfaceVariant: '#d3e4fe',

  onSurface: '#0b1c30',
  onSurfaceVariant: '#45464d',
  inverseSurface: '#213145',
  inverseOnSurface: '#eaf1ff',

  outline: '#76777d',
  outlineVariant: '#c6c6cd',
  surfaceTint: '#565e74',

  primary: '#000000',
  onPrimary: '#ffffff',
  primaryContainer: '#131b2e',
  onPrimaryContainer: '#7c839b',
  inversePrimary: '#bec6e0',
  primaryFixed: '#dae2fd',
  primaryFixedDim: '#bec6e0',
  onPrimaryFixed: '#131b2e',
  onPrimaryFixedVariant: '#3f465c',

  secondary: '#0051d5',
  onSecondary: '#ffffff',
  secondaryContainer: '#316bf3',
  onSecondaryContainer: '#fefcff',
  secondaryFixed: '#dbe1ff',
  secondaryFixedDim: '#b4c5ff',
  onSecondaryFixed: '#00174b',
  onSecondaryFixedVariant: '#003ea8',

  tertiary: '#000000',
  onTertiary: '#ffffff',
  tertiaryContainer: '#002113',
  onTertiaryContainer: '#009668',
  tertiaryFixed: '#6ffbbe',
  tertiaryFixedDim: '#4edea3',
  onTertiaryFixed: '#002113',
  onTertiaryFixedVariant: '#005236',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  background: '#f8f9ff',
  onBackground: '#0b1c30',

  // Semantic status accents used across status chips / badges in the Stitch screens
  amber500: '#f59e0b',
  amber50: '#fffbeb',
  amber700: '#b45309',
  emerald500: '#10b981',
} as const;

export type ColorToken = keyof typeof colors;
