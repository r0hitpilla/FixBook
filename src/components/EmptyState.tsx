import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Icon } from './Icon';
import { PrimaryButton } from './PrimaryButton';

export interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={28} color={colors.onSurfaceVariant} />
      </View>
      <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: spacing.spaceMd, textAlign: 'center' }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4, textAlign: 'center' }]}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing.spaceLg, width: '100%', maxWidth: 240 }}>
          <PrimaryButton label={actionLabel} onPress={onAction} variant="accent" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.space2xl, paddingHorizontal: spacing.spaceLg },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
