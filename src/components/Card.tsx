import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { shadowCard } from '@/theme/shadows';

export interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
}

// `style` is applied to whichever element is the actual flex item in the
// caller's layout (the Pressable when onPress is set, the View otherwise).
// Applying it to a nested child instead — as a previous version of this
// component did — breaks percentage widths: a percentage can't resolve
// against a Pressable that has no explicit size of its own, so e.g.
// `width: '47%'` collapses to almost nothing instead of half the row.
export function Card({ style, children, onPress, padded = true, ...rest }: CardProps) {
  if (!onPress) {
    return (
      <View style={[styles.base, padded && styles.padded, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        padded && styles.padded,
        style,
        { transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    ...shadowCard,
  },
  padded: {
    padding: spacing.spaceMd,
  },
});
