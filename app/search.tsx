import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';
import { AssetImage, EmptyState, Icon } from '@/components';
import { useAssets } from '@/hooks/useAssets';
import { useDocuments } from '@/hooks/useDocuments';
import { categoryLabel } from '@/constants/categories';

type Result = { id: string; type: 'asset' | 'document'; title: string; subtitle: string; category?: string; photoUrl?: string | null };

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { data: assets } = useAssets();
  const { data: documents } = useDocuments();

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const assetResults: Result[] = (assets ?? [])
      .filter((a) => a.name.toLowerCase().includes(q) || a.brand?.toLowerCase().includes(q) || a.model?.toLowerCase().includes(q))
      .map((a) => ({ id: a.id, type: 'asset', title: a.name, subtitle: categoryLabel(a.category), category: a.category, photoUrl: a.cover_photo_url }));
    const documentResults: Result[] = (documents ?? [])
      .filter((d) => d.title.toLowerCase().includes(q))
      .map((d) => ({ id: d.id, type: 'document', title: d.title, subtitle: d.kind.replace('_', ' ') }));
    return [...assetResults, ...documentResults];
  }, [query, assets, documents]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, paddingTop: insets.top + 12 }}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color={colors.onSurfaceVariant} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholder="Search assets, documents, brands..."
          placeholderTextColor={colors.outline}
          style={[typography.bodyMd, { flex: 1, color: colors.onSurface }]}
        />
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon name="close" size={20} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={{ paddingHorizontal: spacing.margin, paddingTop: spacing.spaceMd, gap: 12, paddingBottom: insets.bottom + 32 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push(item.type === 'asset' ? `/asset/${item.id}` : `/documents/${item.id}`)}
          >
            {item.type === 'asset' ? (
              <AssetImage uri={item.photoUrl} category={item.category} size={44} />
            ) : (
              <View style={styles.docIcon}>
                <Icon name="description" size={18} color={colors.onSurfaceVariant} />
              </View>
            )}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          query ? <EmptyState icon="search" title="No matches" subtitle="Try a different name, brand, or model." /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 14,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd },
  docIcon: { width: 44, height: 44, borderRadius: radius.lg, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
});
