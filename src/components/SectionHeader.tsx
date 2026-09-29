import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Icon } from './Icon';

export interface SectionHeaderProps {
  title: string;
  badgeCount?: number;
  actionLabel?: string;
  onActionPress?: () => void;
  leadingDotColor?: string;
}

export function SectionHeader({ title, badgeCount, actionLabel, onActionPress, leadingDotColor }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        {leadingDotColor ? <View style={[styles.dot, { backgroundColor: leadingDotColor }]} /> : null}
        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>{title}</Text>
        {typeof badgeCount === 'number' ? (
          <View style={styles.badge}>
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>{badgeCount}</Text>
          </View>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onActionPress} style={styles.actionRow} hitSlop={8}>
          <Text style={[typography.labelSm, { color: colors.secondary, fontWeight: '600' }]}>{actionLabel}</Text>
          <Icon name="chevron_right" size={16} color={colors.secondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.spaceSm,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerHighest,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
