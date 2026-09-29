import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { shadowCard } from '@/theme/shadows';

export interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
}

export function Card({ style, children, onPress, padded = true, ...rest }: CardProps) {
  const content = (
    <View style={[styles.base, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.99 : 1 }] }]}
    >
      {content}
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
