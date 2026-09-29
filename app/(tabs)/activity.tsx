import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors, spacing, typography } from '@/theme';
import { AppHeader, Card, EmptyState, Icon } from '@/components';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { formatDateShort } from '@/lib/format';

interface ActivityItem {
  id: string;
  kind: 'maintenance' | 'document' | 'asset';
  title: string;
  subtitle: string;
  occurredAt: string;
  assetId: string | null;
}

function useActivityFeed() {
  const userId = useAuthStore((s) => s.session?.user.id);
  return useQuery({
    queryKey: ['activity', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ActivityItem[]> => {
      const [assets, maintenance, documents] = await Promise.all([
        supabase.from('assets').select('id, name, created_at').order('created_at', { ascending: false }).limit(10),
        supabase
          .from('maintenance_records')
          .select('id, title, performed_at, asset_id, assets(name)')
          .order('performed_at', { ascending: false })
          .limit(10),
        supabase.from('documents').select('id, title, created_at, asset_id').order('created_at', { ascending: false }).limit(10),
      ]);
      const items: ActivityItem[] = [
        ...(assets.data ?? []).map((a: any) => ({
          id: `asset-${a.id}`,
          kind: 'asset' as const,
          title: `Added ${a.name}`,
          subtitle: 'New asset',
          occurredAt: a.created_at,
          assetId: a.id,
        })),
        ...(maintenance.data ?? []).map((m: any) => ({
          id: `maint-${m.id}`,
          kind: 'maintenance' as const,
          title: m.title,
          subtitle: m.assets?.name ?? 'Maintenance logged',
          occurredAt: m.performed_at,
          assetId: m.asset_id,
        })),
        ...(documents.data ?? []).map((d: any) => ({
          id: `doc-${d.id}`,
          kind: 'document' as const,
          title: `Saved ${d.title}`,
          subtitle: 'Document',
          occurredAt: d.created_at,
          assetId: d.asset_id,
        })),
      ];
      return items.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
    },
  });
}

const KIND_ICON: Record<ActivityItem['kind'], string> = {
  maintenance: 'build_circle',
  document: 'description',
  asset: 'inventory_2',
};

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useActivityFeed();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Activity" eyebrow="FixBook" />
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: insets.top + 80, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 96, gap: 12 }}
        renderItem={({ item }) => (
          <Card onPress={item.assetId ? () => router.push(`/asset/${item.assetId}`) : undefined}>
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <Icon name={KIND_ICON[item.kind]} size={18} color={colors.onSurface} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>{formatDateShort(item.occurredAt)}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !isLoading ? <EmptyState icon="monitoring" title="No activity yet" subtitle="Everything you add or log will show up here." /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
});
