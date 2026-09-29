import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

// Stitch screens were designed with Google's "Material Symbols Outlined" font.
// React Native has no equivalent variable-font package, so each symbol name is
// mapped to the closest glyph in @expo/vector-icons (MaterialIcons first,
// falling back to MaterialCommunityIcons / Ionicons for symbols that only
// exist in the newer Material Symbols set).
type IconFamily = 'material' | 'community' | 'ionicon';

const OVERRIDES: Record<string, { family: IconFamily; name: string }> = {
  coffee_maker: { family: 'community', name: 'coffee-maker' },
  shield_with_heart: { family: 'community', name: 'shield-heart' },
  shopping_bag: { family: 'ionicon', name: 'bag-outline' },
  event_repeat: { family: 'community', name: 'calendar-sync' },
  history_toggle_off: { family: 'community', name: 'history' },
  security_update_good: { family: 'community', name: 'shield-check' },
  document_scanner: { family: 'community', name: 'text-recognition' },
  workspace_premium: { family: 'community', name: 'certificate' },
  arrow_back_ios_new: { family: 'ionicon', name: 'chevron-back' },
  qr_code_scanner: { family: 'community', name: 'qrcode-scan' },
  laptop_mac: { family: 'material', name: 'laptop-mac' },
  home_repair_service: { family: 'community', name: 'toolbox-outline' },
  two_wheeler: { family: 'material', name: 'two-wheeler' },
  grid_view: { family: 'material', name: 'grid-view' },
  inventory_2: { family: 'material', name: 'inventory-2' },
  account_circle: { family: 'material', name: 'account-circle' },
};

function snakeToKebab(name: string) {
  return name.replace(/_/g, '-');
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  filled?: boolean;
  style?: any;
}

export function Icon({ name, size = 20, color = '#0b1c30', style }: IconProps) {
  const override = OVERRIDES[name];
  if (override) {
    if (override.family === 'community') {
      return <MaterialCommunityIcons name={override.name as any} size={size} color={color} style={style} />;
    }
    if (override.family === 'ionicon') {
      return <Ionicons name={override.name as any} size={size} color={color} style={style} />;
    }
  }
  const materialName = override?.name ?? snakeToKebab(name);
  return <MaterialIcons name={materialName as any} size={size} color={color} style={style} />;
}
