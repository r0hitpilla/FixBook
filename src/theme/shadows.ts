import { Platform, ViewStyle } from 'react-native';

function elevation(shadowOpacity: number, shadowRadius: number, elevationValue: number, offsetY = 2): ViewStyle {
  return Platform.select<ViewStyle>({
    android: { elevation: elevationValue },
    default: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity,
      shadowRadius,
    },
  })!;
}

// Level 1: stacked cards & lists (most common card shadow across Stitch screens)
export const shadowCard = elevation(0.06, 10, 3, 2);
// Level 0-ish: subtler grid tiles
export const shadowTile = elevation(0.045, 6, 2, 1);
// Level 2: floating action bars, hover/active cards
export const shadowFloating = elevation(0.12, 18, 6, 6);
// Level 3: modals, bottom sheets, dropdowns
export const shadowModal = elevation(0.18, 32, 10, 10);

export const shadows = { shadowCard, shadowTile, shadowFloating, shadowModal };
