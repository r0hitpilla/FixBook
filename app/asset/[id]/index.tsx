import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';
import { AppHeader, DocumentCard, Icon, MaintenanceCard, PrimaryButton, SecondaryButton, SectionHeader } from '@/components';
import { useAsset, useUpdateAsset } from '@/hooks/useAssets';
import { useMaintenanceRecords, useMaintenanceTasks } from '@/hooks/useMaintenance';
import { useDocuments, useUploadDocument } from '@/hooks/useDocuments';
import { useAssetExpenses } from '@/hooks/useExpenses';
import { useAssetWarranties } from '@/hooks/useWarranties';
import { categoryLabel } from '@/constants/categories';
import { formatCurrencyINR, formatDateShort, relativeDaysLabel } from '@/lib/format';

export default function AssetDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: asset, isLoading } = useAsset(id);
  const { data: tasks } = useMaintenanceTasks(id);
  const { data: records } = useMaintenanceRecords(id);
  const { data: documents } = useDocuments(id);
  const { data: expenses } = useAssetExpenses(id, new Date().getFullYear());
  const { data: warranties } = useAssetWarranties(id);
  const updateAsset = useUpdateAsset();
  const uploadDocument = useUploadDocument();
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [attaching, setAttaching] = useState(false);

  if (isLoading || !asset) {
    return (
      <View style={[styles.center, { paddingTop: insets.top + 80 }]}>
        <ActivityIndicator color={colors.secondary} />
      </View>
    );
  }

  const nextTask = tasks?.[0];
  const activeWarranty = warranties?.find((w) => w.status !== 'expired');

  async function handleAttach() {
    if (!asset) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (result.canceled || !result.assets?.[0]) return;
    setAttaching(true);
    try {
      const file = result.assets[0];
      const info = await FileSystem.getInfoAsync(file.uri);
      await uploadDocument.mutateAsync({
        assetId: asset.id,
        kind: 'other',
        title: `${asset.name} attachment`,
        localUri: file.uri,
        mimeType: file.mimeType ?? 'image/jpeg',
        fileSizeBytes: info.exists ? (info.size ?? 0) : 0,
      });
    } catch (e: any) {
      Alert.alert('Could not attach file', e?.message ?? 'Please try again.');
    } finally {
      setAttaching(false);
    }
  }

  async function saveNote() {
    if (!asset) return;
    await updateAsset.mutateAsync({ id: asset.id, patch: { notes: noteDraft } });
    setNoteModalOpen(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title={asset.name} showBack avatarUrl={undefined} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: insets.bottom + 32 }}>
        <View style={styles.heroWrap}>
          {asset.cover_photo_url ? (
            <Image source={{ uri: asset.cover_photo_url }} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.heroPlaceholder]}>
              <Icon name="inventory_2" size={40} color={colors.onSurfaceVariant} />
            </View>
          )}
          <View style={styles.heroGradient} />
          <View style={styles.heroTopActions}>
            <Pressable style={styles.roundIconButton} onPress={handleAttach}>
              {attaching ? <ActivityIndicator size="small" color={colors.onSurface} /> : <Icon name="add_a_photo" size={18} color={colors.onSurface} />}
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.healthyBadge}>
                <View style={styles.healthyDot} />
                <Text style={[typography.labelSm, { color: colors.onTertiaryContainer, textTransform: 'uppercase' }]}>
                  {nextTask ? 'Attention needed' : 'Up to date'}
                </Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={[typography.labelSm, { color: '#fff' }]}>{categoryLabel(asset.category)}</Text>
              </View>
              {activeWarranty ? (
                <View style={styles.categoryBadge}>
                  <Text style={[typography.labelSm, { color: '#fff' }]}>
                    Warranty till {formatDateShort(activeWarranty.expiry_date)}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[typography.headlineLg, { color: '#fff', marginTop: 4 }]}>{asset.name}</Text>
            <Text style={[typography.bodySm, { color: 'rgba(255,255,255,0.85)' }]}>
              {[asset.brand, asset.model, asset.registration_number].filter(Boolean).join(' · ') || 'No specs added yet'}
            </Text>
          </View>
        </View>

        <View style={styles.telemetryRow}>
          <TelemetryCell label="Category" value={categoryLabel(asset.category)} />
          <TelemetryCell label="Brand" value={asset.brand ?? '—'} />
          <TelemetryCell
            label="Purchased"
            value={asset.purchase_date ? formatDateShort(asset.purchase_date) : '—'}
            valueColor={colors.onTertiaryContainer}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.countdownCard}>
            <View style={styles.countdownTop}>
              <View style={styles.countdownLeft}>
                <View style={styles.countdownIcon}>
                  <Icon name="build_circle" size={24} color={colors.secondaryContainer} />
                </View>
                <View>
                  <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>
                    Maintenance Countdown
                  </Text>
                  <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
                    {nextTask ? relativeDaysLabel(nextTask.due_date ?? '') : 'Nothing scheduled'}
                  </Text>
                </View>
              </View>
            </View>
            {nextTask ? (
              <>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
                <View style={styles.countdownFooterRow}>
                  <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>{nextTask.title}</Text>
                  <Text style={[typography.labelSm, { color: colors.onSurface, fontWeight: '600' }]}>
                    {nextTask.due_date ? formatDateShort(nextTask.due_date) : ''}
                  </Text>
                </View>
              </>
            ) : null}
            <View style={styles.countdownActions}>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="Schedule Service" icon="calendar_month" onPress={() => router.push(`/asset/${asset.id}/add-maintenance`)} />
              </View>
            </View>
          </View>
        </View>

        {documents && documents.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="Stored Documents" badgeCount={documents.length} actionLabel="Add Doc" onActionPress={() => router.push('/add')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  title={doc.title}
                  subtitle={doc.kind.replace('_', ' ')}
                  kind={doc.kind}
                  meta={doc.expiry_date ? `Exp: ${formatDateShort(doc.expiry_date)}` : undefined}
                  onPress={() => router.push(`/documents/${doc.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {expenses && expenses.total > 0 ? (
          <View style={styles.section}>
            <View style={styles.spendCard}>
              <View style={styles.spendTopRow}>
                <View>
                  <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>
                    {new Date().getFullYear()} Maintenance Spend
                  </Text>
                  <View style={styles.spendAmountRow}>
                    <Text style={[typography.headlineXl, { color: colors.onSurface }]}>{formatCurrencyINR(expenses.total)}</Text>
                    <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>across {expenses.visitCount} visits</Text>
                  </View>
                </View>
                <View style={styles.spendIconWrap}>
                  <Icon name="query_stats" size={20} color={colors.onSurface} />
                </View>
              </View>
              <View style={styles.spendChipsRow}>
                {Object.entries(expenses.byCategory).map(([category, amount]) => (
                  <View key={category} style={styles.spendChip}>
                    <View style={styles.spendChipDot} />
                    <Text style={[typography.labelSm, { color: colors.onSurface }]}>
                      {category.replace('_', ' ')} <Text style={{ fontWeight: '700' }}>{formatCurrencyINR(amount)}</Text>
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {records && records.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              title="Maintenance History"
              badgeCount={records.length}
              actionLabel={`View all (${records.length})`}
              onActionPress={() => router.push(`/asset/${asset.id}/timeline`)}
            />
            <View style={styles.historyCard}>
              {records.slice(0, 4).map((record, idx) => (
                <MaintenanceCard key={record.id} record={record} showDivider={idx < Math.min(records.length, 4) - 1} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.notesCard}>
            <View style={styles.notesHeaderRow}>
              <View style={styles.eyebrowRow}>
                <Icon name="description" size={20} color={colors.onSurfaceVariant} />
                <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Asset Notes</Text>
              </View>
              <Pressable
                onPress={() => {
                  setNoteDraft(asset.notes ?? '');
                  setNoteModalOpen(true);
                }}
              >
                <Text style={[typography.labelMd, { color: colors.secondary, fontWeight: '600' }]}>
                  {asset.notes ? 'Edit' : '+ Add Note'}
                </Text>
              </Pressable>
            </View>
            {asset.notes ? (
              <Text style={[typography.bodySm, { color: colors.onSurface, marginTop: 8 }]}>{asset.notes}</Text>
            ) : (
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 8 }]}>
                No notes yet. Jot down settings, mods, or reminders for future you.
              </Text>
            )}
          </View>
        </View>

        <View style={[styles.section, styles.quickActionsRow]}>
          <View style={{ flex: 1 }}>
            <SecondaryButton label="Log Service Record" icon="add_circle" onPress={() => router.push(`/asset/${asset.id}/add-maintenance`)} />
          </View>
          <View style={{ flex: 1 }}>
            <SecondaryButton label="Attach Bill / Photo" icon="upload_file" onPress={handleAttach} />
          </View>
        </View>
      </ScrollView>

      <Modal visible={noteModalOpen} transparent animationType="fade" onRequestClose={() => setNoteModalOpen(false)}>
        <View style={styles.noteBackdrop}>
          <View style={styles.noteModal}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: 8 }]}>Asset note</Text>
            <TextInput
              value={noteDraft}
              onChangeText={setNoteDraft}
              multiline
              style={styles.noteInput}
              placeholder="e.g. Cold tire pressure: front 29 PSI, rear 33 PSI"
              placeholderTextColor={colors.outline}
            />
            <View style={styles.noteActionsRow}>
              <View style={{ flex: 1 }}>
                <SecondaryButton label="Cancel" onPress={() => setNoteModalOpen(false)} />
              </View>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="Save" onPress={saveNote} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TelemetryCell({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.telemetryCell}>
      <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>{label}</Text>
      <Text style={[typography.headlineSm, { color: valueColor ?? colors.onSurface, marginTop: 2 }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  heroWrap: { height: 280, backgroundColor: colors.surfaceContainer },
  heroPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  heroGradient: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(19,27,46,0.35)' },
  heroTopActions: { position: 'absolute', top: 12, right: spacing.margin, flexDirection: 'row', gap: 8 },
  roundIconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' },
  heroBottom: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  heroBadgeRow: { flexDirection: 'row', gap: 8 },
  healthyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.tertiaryFixed, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  healthyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.onTertiaryContainer },
  categoryBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  telemetryRow: { flexDirection: 'row', backgroundColor: colors.surfaceContainerLowest, paddingVertical: 12 },
  telemetryCell: { flex: 1, alignItems: 'center' },
  section: { paddingHorizontal: spacing.margin, marginTop: spacing.spaceLg },
  countdownCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd, gap: 14 },
  countdownTop: { flexDirection: 'row', justifyContent: 'space-between' },
  countdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  countdownIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceContainer, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.secondaryContainer, borderRadius: 4 },
  countdownFooterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  countdownActions: { flexDirection: 'row', gap: 8 },
  spendCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd, gap: 12 },
  spendTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  spendAmountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 },
  spendIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  spendChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  spendChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surfaceContainer, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  spendChipDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondary },
  historyCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd },
  notesCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd },
  notesHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quickActionsRow: { flexDirection: 'row', gap: 12, marginBottom: spacing.spaceLg },
  noteBackdrop: { flex: 1, backgroundColor: 'rgba(11,28,48,0.4)', alignItems: 'center', justifyContent: 'center', padding: spacing.margin },
  noteModal: { width: '100%', backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd },
  noteInput: { minHeight: 100, textAlignVertical: 'top', color: colors.onSurface, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.lg, padding: 12, ...typography.bodyMd },
  noteActionsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
});
