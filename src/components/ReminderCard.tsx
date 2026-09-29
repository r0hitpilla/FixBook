import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Card } from './Card';
import { AssetImage } from './AssetImage';
import { relativeDaysLabel } from '@/lib/format';

export interface ReminderCardProps {
  taskId: string;
  assetName: string;
  assetCategory?: string;
  assetPhotoUrl?: string | null;
  dueDate: string;
  detail: string;
  scheduleLabel: string;
}

export function ReminderCard({ taskId, assetName, assetCategory, assetPhotoUrl, dueDate, detail, scheduleLabel }: ReminderCardProps) {
  const due = relativeDaysLabel(dueDate);
  const isOverdue = due.startsWith('Overdue');
  return (
    <Card onPress={() => router.push(`/reminder/${taskId}`)}>
      <View style={styles.row}>
        <AssetImage uri={assetPhotoUrl} category={assetCategory} size={56} />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, flex: 1 }]} numberOfLines={1}>
              {assetName}
            </Text>
            <View style={[styles.badge, { backgroundColor: isOverdue ? '#FEF2F2' : colors.amber50 }]}>
              <Text style={[typography.labelSm, { color: isOverdue ? '#DC2626' : colors.amber700, fontWeight: '600' }]}>
                {due}
              </Text>
            </View>
          </View>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]} numberOfLines={1}>
            {detail}
          </Text>
          <View style={styles.footerRow}>
            <Text style={[typography.codeMd, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
              {scheduleLabel}
            </Text>
            <Text style={[typography.labelSm, { color: colors.secondary, fontWeight: '600' }]}>View ›</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.spaceMd },
  body: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(220,233,255,0.4)',
  },
});
