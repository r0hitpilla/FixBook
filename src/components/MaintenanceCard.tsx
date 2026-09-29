import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Icon } from './Icon';
import { formatCurrencyINR, formatDateShort } from '@/lib/format';
import type { MaintenanceRecord } from '@/types/models';

export interface MaintenanceCardProps {
  record: Pick<MaintenanceRecord, 'title' | 'performed_at' | 'odometer_km' | 'cost' | 'service_provider' | 'notes'>;
  showDivider?: boolean;
}

export function MaintenanceCard({ record, showDivider }: MaintenanceCardProps) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Icon name="check_circle" size={18} color={colors.onTertiaryContainer} />
        </View>
        <View style={styles.body}>
          <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
            {record.title}
          </Text>
          <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
            {formatDateShort(record.performed_at)}
            {record.odometer_km ? ` · ${record.odometer_km.toLocaleString()} km` : ''}
            {record.service_provider ? ` · ${record.service_provider}` : ''}
          </Text>
          {record.notes ? (
            <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 4 }]} numberOfLines={2}>
              {record.notes}
            </Text>
          ) : null}
        </View>
        <View style={styles.trailing}>
          {record.cost != null ? (
            <Text style={[typography.labelLg, { color: colors.onSurface, fontWeight: '700' }]}>
              {formatCurrencyINR(record.cost)}
            </Text>
          ) : null}
          <Text style={[typography.labelSm, { color: colors.onTertiaryContainer }]}>Logged</Text>
        </View>
      </View>
      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.gutterSm, paddingVertical: 4 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  body: { flex: 1, minWidth: 0 },
  trailing: { alignItems: 'flex-end', marginLeft: 8 },
  divider: { height: 1, backgroundColor: colors.surfaceContainer, marginVertical: spacing.spaceSm },
});
