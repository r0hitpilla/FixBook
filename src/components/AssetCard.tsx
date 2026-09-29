import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Card } from './Card';
import { AssetImage } from './AssetImage';
import { categoryLabel } from '@/constants/categories';
import type { Asset } from '@/types/models';

export interface AssetCardProps {
  asset: Pick<Asset, 'id' | 'name' | 'category' | 'cover_photo_url'>;
  subtitle?: string;
  trailing?: React.ReactNode;
}

export function AssetCard({ asset, subtitle, trailing }: AssetCardProps) {
  return (
    <Card onPress={() => router.push(`/asset/${asset.id}`)}>
      <View style={styles.row}>
        <AssetImage uri={asset.cover_photo_url} category={asset.category} size={56} />
        <View style={styles.body}>
          <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
            {asset.name}
          </Text>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]} numberOfLines={1}>
            {subtitle ?? categoryLabel(asset.category)}
          </Text>
        </View>
        {trailing}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.spaceMd },
  body: { flex: 1, minWidth: 0 },
});
