import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { AppHeader, AssetCard, EmptyState } from '@/components';
import { useAssets } from '@/hooks/useAssets';
import { CATEGORY_LIST, categoryLabel } from '@/constants/categories';

export default function AssetsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string }>();
  const { data: assets, isLoading } = useAssets();
  const [filter, setFilter] = useState<string | 'all'>(params.category ?? 'all');

  const filtered = useMemo(() => {
    if (!assets) return [];
    if (filter === 'all') return assets;
    return assets.filter((a) => a.category === filter);
  }, [assets, filter]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Assets" eyebrow="FixBook" avatarUrl={undefined} rightActions={[{ icon: 'search', onPress: () => router.push('/search') }]} />
      <View style={{ paddingTop: insets.top + 76 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['all', ...CATEGORY_LIST]}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: spacing.margin, gap: 8 }}
          renderItem={({ item }) => {
            const active = filter === item;
            return (
              <Pressable
                onPress={() => setFilter(item)}
                style={[styles.chip, active && { backgroundColor: colors.onSurface }]}
              >
                <Text style={[typography.labelMd, { color: active ? colors.surfaceContainerLowest : colors.onSurfaceVariant }]}>
                  {item === 'all' ? 'All' : categoryLabel(item)}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.margin, gap: 12, paddingBottom: insets.bottom + 96 }}
        renderItem={({ item }) => <AssetCard asset={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="inventory_2"
              title={filter === 'all' ? 'No assets yet' : `No ${categoryLabel(filter).toLowerCase()} yet`}
              subtitle="Scan a receipt or add one manually to get started."
              actionLabel="Add asset"
              onAction={() => router.push('/add')}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
});
