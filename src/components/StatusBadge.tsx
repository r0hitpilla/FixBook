import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '@/theme';

export type AssetStatus = 'healthy' | 'due_soon' | 'overdue';

const STATUS_STYLE: Record<AssetStatus, { bg: string; fg: string; label: string }> = {
  healthy: { bg: '#ECFDF5', fg: '#059669', label: 'Healthy' },
  due_soon: { bg: colors.amber50, fg: '#D97706', label: 'Due Soon' },
  overdue: { bg: '#FEF2F2', fg: '#DC2626', label: 'Overdue' },
};

export interface StatusBadgeProps {
  status: AssetStatus;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const s = STATUS_STYLE[status];
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.fg }]} />
      <Text style={[typography.labelSm, { color: s.fg, textTransform: 'uppercase' }]}>
        {label ?? s.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 26,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
