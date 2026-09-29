import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';
import { AppHeader, AssetImage, EmptyState, PrimaryButton } from '@/components';
import { useAsset } from '@/hooks/useAssets';
import { useMaintenanceRecords } from '@/hooks/useMaintenance';
import { formatCurrencyINR, formatDateShort } from '@/lib/format';
import type { MaintenanceRecord } from '@/types/models';

export default function MaintenanceTimelineScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: asset } = useAsset(id);
  const { data: records, isLoading } = useMaintenanceRecords(id);

  const { totalSpent, avgIntervalMonths, groupedByYear } = useMemo(() => {
    const rows = records ?? [];
    const total = rows.reduce((sum, r) => sum + Number(r.cost ?? 0), 0);
    const sortedAsc = [...rows].sort((a, b) => new Date(a.performed_at).getTime() - new Date(b.performed_at).getTime());
    let avgMonths = 0;
    if (sortedAsc.length > 1) {
      const first = new Date(sortedAsc[0].performed_at).getTime();
      const last = new Date(sortedAsc[sortedAsc.length - 1].performed_at).getTime();
      const spanDays = (last - first) / 86_400_000;
      avgMonths = spanDays / 30 / (sortedAsc.length - 1);
    }
    const grouped = new Map<number, MaintenanceRecord[]>();
    for (const r of rows) {
      const year = new Date(r.performed_at).getFullYear();
      if (!grouped.has(year)) grouped.set(year, []);
      grouped.get(year)!.push(r);
    }
    return {
      totalSpent: total,
      avgIntervalMonths: avgMonths,
      groupedByYear: [...grouped.entries()].sort((a, b) => b[0] - a[0]),
    };
  }, [records]);

  if (!asset || isLoading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top + 80 }]}>
        <ActivityIndicator color={colors.secondary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Maintenance Timeline" showBack avatarUrl={undefined} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32 }}
      >
        <View style={styles.assetRow}>
          <AssetImage uri={asset.cover_photo_url} category={asset.category} size={48} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
              {asset.name}
            </Text>
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
              {[asset.brand, asset.registration_number].filter(Boolean).join(' · ') || 'No specs added'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCell label="Total Spent" value={formatCurrencyINR(totalSpent)} />
          <View style={styles.statDivider} />
          <StatCell label="Services" value={`${records?.length ?? 0} Logged`} />
          <View style={styles.statDivider} />
          <StatCell label="Avg Interval" value={avgIntervalMonths ? `${avgIntervalMonths.toFixed(1)} mo` : '—'} />
        </View>

        {groupedByYear.length === 0 ? (
          <EmptyState
            icon="build_circle"
            title="No maintenance logged yet"
            subtitle="Add your first service record to start building a history."
          />
        ) : (
          groupedByYear.map(([year, yearRecords]) => (
            <View key={year} style={{ marginTop: spacing.spaceLg }}>
              <View style={styles.yearRow}>
                <Text style={[typography.headlineLg, { color: colors.onSurface }]}>{year}</Text>
                <View style={styles.yearLine} />
                <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>{yearRecords.length} events</Text>
              </View>
              <View style={styles.timelineTrack}>
                {yearRecords.map((record, idx) => (
                  <View key={record.id} style={styles.timelineItem}>
                    <View style={styles.timelineDotColumn}>
                      <View style={[styles.timelineDot, idx === 0 && year === groupedByYear[0][0] && styles.timelineDotActive]} />
                      {idx < yearRecords.length - 1 ? <View style={styles.timelineConnector} /> : null}
                    </View>
                    <View style={styles.timelineCard}>
                      <View style={styles.timelineTopRow}>
                        <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
                          {formatDateShort(record.performed_at)}
                          {record.odometer_km ? ` · ${record.odometer_km.toLocaleString()} km` : ''}
                        </Text>
                        {record.cost != null ? (
                          <Text style={[typography.headlineSm, { color: colors.onSurface }]}>{formatCurrencyINR(record.cost)}</Text>
                        ) : null}
                      </View>
                      <View style={styles.timelineTitleRow}>
                        <Text style={[typography.headlineSm, { color: colors.onSurface, flex: 1 }]}>{record.title}</Text>
                        {record.service_provider ? (
                          <View style={styles.providerChip}>
                            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>{record.service_provider}</Text>
                          </View>
                        ) : null}
                      </View>
                      {record.notes ? (
                        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]}>{record.notes}</Text>
                      ) : null}
                      {record.invoice_reference ? (
                        <View style={styles.invoiceChip}>
                          <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>Invoice #{record.invoice_reference}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <View style={[styles.fabWrap, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton label="Add maintenance" icon="add" onPress={() => router.push(`/asset/${asset.id}/add-maintenance`)} />
      </View>
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>{label}</Text>
      <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: 2 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  assetRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerLow, borderRadius: radius.xl, padding: spacing.spaceMd, marginTop: spacing.spaceMd },
  statDivider: { width: 1, height: 32, backgroundColor: colors.outlineVariant },
  yearRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.spaceMd },
  yearLine: { flex: 1, height: 1, backgroundColor: colors.outlineVariant },
  timelineTrack: { gap: 0 },
  timelineItem: { flexDirection: 'row', gap: 12 },
  timelineDotColumn: { alignItems: 'center', width: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.outline, marginTop: 6 },
  timelineDotActive: { backgroundColor: colors.secondaryContainer, width: 14, height: 14, borderRadius: 7 },
  timelineConnector: { width: 2, flex: 1, backgroundColor: colors.outlineVariant, marginVertical: 4 },
  timelineCard: { flex: 1, backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd, marginBottom: 12 },
  timelineTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  providerChip: { backgroundColor: colors.surfaceContainer, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  invoiceChip: { alignSelf: 'flex-start', backgroundColor: colors.surfaceContainerLow, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginTop: 8 },
  fabWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.margin, paddingTop: 12, backgroundColor: colors.surface },
});
