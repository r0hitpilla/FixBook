import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { AppHeader, Icon, ScanButton, SecondaryButton } from '@/components';
import { useAddFlowStore, type ScanDocKind } from '@/store/addFlow';

const DEMOS: { icon: string; title: string; badge: string; badgeColor: string; meta: string[]; docKind: ScanDocKind }[] = [
  {
    icon: 'receipt_long',
    title: 'Store invoice or Amazon receipt',
    badge: 'ACTIVE',
    badgeColor: '#059669',
    meta: ['MacBook Air M3', '14 Oct 2024', '$1,099.00'],
    docKind: 'invoice',
  },
  {
    icon: 'shield',
    title: 'Warranty card or extended plan',
    badge: 'SYNCING',
    badgeColor: colors.secondary,
    meta: ['24 Mos Coverage', 'Expires: Oct 2026'],
    docKind: 'warranty_card',
  },
  {
    icon: 'qr_code_scanner',
    title: 'Product label or barcode',
    badge: 'HARDWARE',
    badgeColor: colors.onSurfaceVariant,
    meta: ['SN: C02XG78LP0V4', 'Model: A2681'],
    docKind: 'product_label',
  },
  {
    icon: 'directions_car',
    title: 'Vehicle RC or Insurance',
    badge: 'AUTO',
    badgeColor: colors.secondary,
    meta: ['Renew by: Aug 2025', 'IDV: $18,400'],
    docKind: 'vehicle_doc',
  },
];

export default function AddAnythingScreen() {
  const insets = useSafeAreaInsets();
  const setDocKind = useAddFlowStore((s) => s.setDocKind);
  const setCapture = useAddFlowStore((s) => s.setCapture);

  function goScan(docKind: ScanDocKind = 'invoice') {
    setDocKind(docKind);
    router.push('/add/scan');
  }

  async function handleUpload() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const file = result.assets[0];
    setCapture(file.uri, file.mimeType ?? 'application/octet-stream');
    router.push('/add/review');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Add Asset Flow" showBack avatarUrl={undefined} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32 }}
      >
        <View style={styles.eyebrowRow}>
          <View style={styles.dot} />
          <Text style={[typography.labelMd, { color: colors.secondary, textTransform: 'uppercase' }]}>Creation Studio</Text>
        </View>

        <Text style={[typography.headlineXl, { color: colors.onSurface, marginTop: 12 }]}>What do you want to remember?</Text>
        <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
          Scan any receipt, warranty card, or label. FixBook automatically reads details, models, and dates.
        </Text>

        <View style={{ marginTop: spacing.spaceLg }}>
          <ScanButton onPress={() => goScan('invoice')} />
        </View>

        <View style={styles.rowButtons}>
          <View style={{ flex: 1 }}>
            <SecondaryButton label="Upload PDF / File" icon="upload_file" onPress={handleUpload} />
          </View>
          <View style={{ flex: 1 }}>
            <SecondaryButton label="Add Manually" icon="edit_note" onPress={() => router.push('/add/manual')} />
          </View>
        </View>

        <View style={styles.demoHeaderRow}>
          <View style={styles.eyebrowRow}>
            <Icon name="auto_awesome" size={16} color={colors.secondary} />
            <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Try scanning...</Text>
          </View>
          <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>AI EXTRACTION DEMOS</Text>
        </View>

        <View style={{ gap: 12 }}>
          {DEMOS.map((demo) => (
            <View key={demo.title} style={styles.demoCard} onTouchEnd={() => goScan(demo.docKind)}>
              <View style={styles.demoThumb}>
                <Icon name={demo.icon} size={22} color={colors.onSurfaceVariant} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.demoTitleRow}>
                  <Text style={[typography.headlineSm, { color: colors.onSurface, flex: 1 }]} numberOfLines={1}>
                    {demo.title}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: `${demo.badgeColor}1A` }]}>
                    <Text style={[typography.labelSm, { color: demo.badgeColor }]}>{demo.badge}</Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  {demo.meta.map((m) => (
                    <View key={m} style={styles.metaChip}>
                      <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>{m}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footerNote}>
          <Icon name="lock" size={14} color={colors.onSurfaceVariant} />
          <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, flex: 1 }]}>
            FixBook on-device AI runs privately. Your receipts are never shared.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondary },
  rowButtons: { flexDirection: 'row', gap: 12, marginTop: spacing.spaceMd },
  demoHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.spaceXl, marginBottom: spacing.spaceSm },
  demoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 12,
  },
  demoThumb: { width: 48, height: 48, borderRadius: 8, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  demoTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  metaChip: { backgroundColor: colors.surfaceContainerLow, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  footerNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.spaceLg, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 12 },
});
