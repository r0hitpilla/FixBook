import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, typography } from '@/theme';
import { Icon } from './Icon';

type Variant = 'dark' | 'accent' | 'secondary' | 'destructive';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<Variant, { bg: string; fg: string; border?: string }> = {
  dark: { bg: colors.onSurface, fg: colors.surfaceContainerLowest },
  accent: { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer },
  secondary: { bg: colors.surfaceContainerLowest, fg: colors.onSurface, border: colors.outlineVariant },
  destructive: { bg: colors.errorContainer, fg: colors.error },
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'dark',
  icon,
  disabled,
  loading,
  fullWidth = true,
}: PrimaryButtonProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border ? 1 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          width: fullWidth ? '100%' : undefined,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={18} color={v.fg} /> : null}
          <Text style={[typography.labelLg, { color: v.fg }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
