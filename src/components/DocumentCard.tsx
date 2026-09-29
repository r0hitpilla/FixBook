import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { shadowTile } from '@/theme/shadows';
import { Icon } from './Icon';
import type { DocumentKind } from '@/types/models';

const KIND_ICON: Record<DocumentKind, string> = {
  invoice: 'receipt_long',
  warranty_card: 'workspace_premium',
  product_label: 'qr_code_scanner',
  insurance: 'shield',
  vehicle_doc: 'badge',
  service_receipt: 'receipt_long',
  purchase_receipt: 'receipt_long',
  other: 'description',
};

export interface DocumentCardProps {
  title: string;
  subtitle: string;
  kind: DocumentKind;
  meta?: string;
  metaColor?: string;
  verified?: boolean;
  onPress?: () => void;
  width?: number;
}

export function DocumentCard({ title, subtitle, kind, meta, metaColor, verified, onPress, width = 155 }: DocumentCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { width, opacity: pressed ? 0.9 : 1 }]}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Icon name={KIND_ICON[kind]} size={20} color={colors.onSurface} />
        </View>
        {verified ? <Icon name="verified" size={18} color={colors.onTertiaryContainer} /> : null}
      </View>
      <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, marginTop: 2 }]} numberOfLines={1}>
        {subtitle}
      </Text>
      {meta ? (
        <Text style={[typography.labelSm, { color: metaColor ?? colors.onSurfaceVariant, marginTop: 8, fontWeight: '600' }]}>
          {meta}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 116,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: 12,
    justifyContent: 'space-between',
    ...shadowTile,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.spaceSm },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
