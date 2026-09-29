import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { AppHeader, Card, EmptyState, Icon, ReminderCard, SectionHeader } from '@/components';
import { useDashboard } from '@/hooks/useDashboard';
import { useProfile } from '@/hooks/useProfile';
import { CATEGORY_LIST, categoryIcon, categoryLabel } from '@/constants/categories';
import { formatCurrencyINR, timeAgo } from '@/lib/format';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch, isRefetching } = useDashboard();
  const { data: profile } = useProfile();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader
        title="Dashboard"
        eyebrow="FixBook"
        avatarUrl={profile?.avatar_url ?? null}
        onAvatarPress={() => router.push('/(tabs)/profile')}
        rightActions={[
          { icon: 'search', onPress: () => router.push('/search') },
          { icon: 'notifications', onPress: () => router.push('/(tabs)/activity'), badge: true },
        ]}
      />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 76, paddingBottom: insets.bottom + 96, paddingHorizontal: spacing.margin }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.secondary} />}
      >
        <Text style={[typography.headlineLg, { color: colors.onSurface }]}>
          {greeting()}, {firstName} 👋
        </Text>
        <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
          Your things are under control.
        </Text>

        {!isLoading && data && data.totalAssets === 0 ? (
          <View style={{ marginTop: spacing.spaceXl }}>
            <EmptyState
              icon="inventory_2"
              title="Nothing here yet"
              subtitle="Scan a receipt or add your first asset to start building your FixBook."
              actionLabel="Add your first thing"
              onAction={() => router.push('/add')}
            />
          </View>
        ) : (
          <>
            <Card style={{ marginTop: spacing.spaceLg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={styles.summaryLeft}>
                <View style={styles.summaryIcon}>
                  <Icon name="verified" size={18} color={colors.onTertiaryFixed} />
                </View>
                <Text style={[typography.labelMd, { color: colors.onSurface }]}>{data?.totalAssets ?? 0} Assets</Text>
                <Text style={{ color: colors.outlineVariant }}>•</Text>
                <Text style={[typography.labelMd, { color: colors.secondary }]}>{data?.upcomingCount ?? 0} Upcoming</Text>
                <Text style={{ color: colors.outlineVariant }}>•</Text>
                <Text style={[typography.labelMd, { color: colors.onSurfaceVariant }]}>
                  {formatCurrencyINR(data?.spendThisYear ?? 0)} this year
                </Text>
              </View>
              <Icon name="insights" size={20} color={colors.outlineVariant} />
            </Card>

            {data && data.needsAttention.length > 0 ? (
              <View style={{ marginTop: spacing.spaceLg }}>
                <SectionHeader title="Needs attention" leadingDotColor={colors.amber500} badgeCount={data.needsAttention.length} />
                <View style={{ gap: 12 }}>
                  {data.needsAttention.map((task) => (
                    <ReminderCard
                      key={task.id}
                      taskId={task.id}
                      assetName={task.asset?.name ?? 'Asset'}
                      assetCategory={task.asset?.category}
                      assetPhotoUrl={task.asset?.cover_photo_url}
                      dueDate={task.due_date ?? new Date().toISOString()}
                      detail={
                        task.last_completed_at
                          ? `Last serviced ${timeAgo(task.last_completed_at)}`
                          : 'Not yet serviced'
                      }
                      scheduleLabel={task.title}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            <View style={{ marginTop: spacing.spaceLg }}>
              <SectionHeader
                title="Your stuff"
                actionLabel={`See all (${data?.totalAssets ?? 0})`}
                onActionPress={() => router.push('/(tabs)/assets')}
              />
              <View style={styles.grid}>
                {CATEGORY_LIST.filter((c) => c !== 'other').map((category) => {
                  const count = data?.categoryCounts[category] ?? 0;
                  return (
                    <Card
                      key={category}
                      style={styles.tile}
                      onPress={() => router.push({ pathname: '/(tabs)/assets', params: { category } })}
                    >
                      <View style={styles.tileTop}>
                        <View style={styles.tileIcon}>
                          <Icon name={categoryIcon(category)} size={20} color={colors.onSurface} />
                        </View>
                        {count > 0 ? <View style={[styles.dot, { backgroundColor: '#10b981' }]} /> : null}
                      </View>
                      <View>
                        <Text style={[typography.headlineSm, { color: colors.onSurface }]}>{count}</Text>
                        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                          {categoryLabel(category)}
                        </Text>
                      </View>
                    </Card>
                  );
                })}
                <Card
                  style={styles.toolsTile}
                  onPress={() => router.push({ pathname: '/(tabs)/assets', params: { category: 'tools_equipment' } })}
                >
                  <View style={styles.toolsRow}>
                    <View style={styles.tileIcon}>
                      <Icon name={categoryIcon('tools_equipment')} size={20} color={colors.onSurface} />
                    </View>
                    <View>
                      <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
                        {data?.categoryCounts.tools_equipment ?? 0}{' '}
                        <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, fontWeight: '400' }]}>items</Text>
                      </Text>
                      <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>{categoryLabel('tools_equipment')}</Text>
                    </View>
                  </View>
                  <Icon name="chevron_right" size={20} color={colors.outlineVariant} />
                </Card>
              </View>
            </View>

            {data && data.recentlyAdded.length > 0 ? (
              <View style={{ marginTop: spacing.spaceLg }}>
                <SectionHeader title="Recently added" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                  {data.recentlyAdded.map((asset) => (
                    <Card key={asset.id} style={styles.recentCard} onPress={() => router.push(`/asset/${asset.id}`)}>
                      <View style={styles.recentRow}>
                        <View style={styles.recentThumb}>
                          {asset.cover_photo_url ? (
                            <Image source={{ uri: asset.cover_photo_url }} style={StyleSheet.absoluteFill} contentFit="cover" />
                          ) : (
                            <Icon name={categoryIcon(asset.category)} size={20} color={colors.onSurfaceVariant} />
                          )}
                        </View>
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
                            {asset.name}
                          </Text>
                          <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
                            Added {timeAgo(asset.created_at)}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', flexShrink: 1 },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.tertiaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: '47%', height: 112, justifyContent: 'space-between' },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between' },
  tileIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  toolsTile: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toolsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recentCard: { width: 256 },
  recentThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
