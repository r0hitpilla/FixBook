import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, typography } from '@/theme';
import { Icon } from './Icon';

export interface ScanButtonProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
  helperText?: string;
  statusLabel?: string;
}

export function ScanButton({
  onPress,
  title = 'Scan something',
  subtitle = 'Invoice · Warranty Card · Product Label · Serial Tag · RC / Vehicle Doc',
  helperText = 'Instant AI auto-fill · Extracts model, date, price, and warranty',
  statusLabel = 'READY TO READ',
}: ScanButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.94 : 1 }]}>
      <LinearGradient
        colors={[colors.surfaceContainerLow, colors.surfaceContainerHigh]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.scanIconWrap}>
            <Icon name="qr_code_scanner" size={26} color={colors.secondary} />
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={[typography.labelSm, { color: colors.onSecondaryFixedVariant }]}>{statusLabel}</Text>
          </View>
        </View>
        <View style={styles.titleRow}>
          <Text style={[typography.headlineLg, { color: colors.onSurface }]}>{title}</Text>
          <Icon name="arrow_forward" size={20} color={colors.secondary} />
        </View>
        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>{subtitle}</Text>
        <View style={styles.helperRow}>
          <Icon name="auto_awesome" size={14} color={colors.secondary} />
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, flex: 1 }]}>{helperText}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.spaceLg,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scanIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.secondary },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.spaceMd },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.spaceMd,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: radius.lg,
    padding: 10,
  },
});
