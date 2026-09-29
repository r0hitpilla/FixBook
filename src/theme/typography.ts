import { TextStyle } from 'react-native';
import { colors } from './colors';

// Matches the fontSize scale from design/stitch-export/obsidian_utility/DESIGN.md.
// React Native has no letter-spacing units in "em", so em values are converted
// to px using each style's own fontSize.
function em(value: number, fontSize: number) {
  return Math.round(value * fontSize * 100) / 100;
}

export const typography = {
  displayLg: { fontFamily: 'Inter_700Bold', fontSize: 40, lineHeight: 48, letterSpacing: em(-0.03, 40) } as TextStyle,
  headlineXl: { fontFamily: 'Inter_700Bold', fontSize: 32, lineHeight: 38, letterSpacing: em(-0.025, 32) } as TextStyle,
  headlineLg: { fontFamily: 'Inter_600SemiBold', fontSize: 26, lineHeight: 32, letterSpacing: em(-0.02, 26) } as TextStyle,
  headlineMd: { fontFamily: 'Inter_600SemiBold', fontSize: 20, lineHeight: 26, letterSpacing: em(-0.015, 20) } as TextStyle,
  headlineSm: { fontFamily: 'Inter_600SemiBold', fontSize: 17, lineHeight: 22, letterSpacing: em(-0.01, 17) } as TextStyle,
  bodyLg: { fontFamily: 'Inter_400Regular', fontSize: 17, lineHeight: 24, letterSpacing: em(-0.005, 17) } as TextStyle,
  bodyMd: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, letterSpacing: 0 } as TextStyle,
  bodySm: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, letterSpacing: em(0.005, 13) } as TextStyle,
  labelLg: { fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 18, letterSpacing: em(0.01, 14) } as TextStyle,
  labelMd: { fontFamily: 'Inter_600SemiBold', fontSize: 12, lineHeight: 16, letterSpacing: em(0.02, 12) } as TextStyle,
  labelSm: { fontFamily: 'Inter_600SemiBold', fontSize: 11, lineHeight: 14, letterSpacing: em(0.04, 11) } as TextStyle,
  codeMd: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 18, letterSpacing: em(-0.01, 13) } as TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;

export const textColor = {
  onSurface: colors.onSurface,
  onSurfaceVariant: colors.onSurfaceVariant,
} as const;
