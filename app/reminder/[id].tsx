import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';
import { AppHeader, AssetImage, Icon, PrimaryButton, SecondaryButton } from '@/components';
import { useAsset } from '@/hooks/useAssets';
import { useCompleteMaintenanceTask, useMaintenanceTask, useUpdateMaintenanceTask } from '@/hooks/useMaintenance';
import { formatDateLong, relativeDaysLabel } from '@/lib/format';

export default function ReminderDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: task, isLoading } = useMaintenanceTask(id);
  const { data: asset } = useAsset(task?.asset_id);
  const completeTask = useCompleteMaintenanceTask();
  const updateTask = useUpdateMaintenanceTask();
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');

  if (isLoading || !task) {
    return (
      <View style={[styles.center, { paddingTop: insets.top + 80 }]}>
        <ActivityIndicator color={colors.secondary} />
      </View>
    );
  }

  const steps = task.steps ?? [];
  const readyCount = steps.filter((_, idx) => checkedSteps[idx]).length;

  async function handleComplete() {
    if (!task) return;
    setSaving(true);
    try {
      await completeTask.mutateAsync(task.id);
      router.back();
    } catch (e: any) {
      Alert.alert('Could not update', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function saveReschedule() {
    if (!task || !rescheduleDate.trim()) return;
    try {
      await updateTask.mutateAsync({ id: task.id, patch: { due_date: rescheduleDate.trim(), status: 'upcoming' } });
      setRescheduleOpen(false);
    } catch (e: any) {
      Alert.alert('Could not reschedule', e?.message ?? 'Please try again.');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Maintenance Reminder" showBack avatarUrl={undefined} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32 }}>
        <View style={styles.windowBanner}>
          <View style={styles.windowIcon}>
            <Icon name="calendar_month" size={20} color={colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>Scheduled Window</Text>
            <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
              {task.due_date ? formatDateLong(task.due_date) : 'No date set'}
            </Text>
          </View>
          {task.due_date ? (
            <View style={styles.dueChip}>
              <Text style={[typography.labelSm, { color: colors.secondary, fontWeight: '600' }]}>{relativeDaysLabel(task.due_date)}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.labelMd, { color: colors.secondary, textTransform: 'uppercase' }]}>Maintenance Task</Text>
            <Text style={[typography.headlineXl, { color: colors.onSurface, marginTop: 4 }]}>{task.title}</Text>
          </View>
        </View>

        {asset ? (
          <Pressable style={styles.equipmentCard} onPress={() => router.push(`/asset/${asset.id}`)}>
            <AssetImage uri={asset.cover_photo_url} category={asset.category} size={48} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>Associated Equipment</Text>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>{asset.name}</Text>
            </View>
            <Icon name="chevron_right" size={20} color={colors.outlineVariant} />
          </Pressable>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Service Diagnostics</Text>
            <View style={styles.routineBadge}>
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>Routine Care</Text>
            </View>
          </View>
          <View style={styles.diagnosticsGrid}>
            <DiagnosticCell icon="history" label="Last completed" value={task.last_completed_at ? formatDateLong(task.last_completed_at) : 'Never'} />
            <DiagnosticCell icon="update" label="Frequency" value={task.interval_days ? `Every ${Math.round(task.interval_days / 30)} months` : '—'} />
            <DiagnosticCell
              icon="payments"
              label="Estimated cost"
              value={task.estimated_cost_low ? `₹${task.estimated_cost_low}–₹${task.estimated_cost_high ?? task.estimated_cost_low}` : '—'}
            />
            <DiagnosticCell icon="build_circle" label="Effort level" value={task.effort_level ?? '—'} />
          </View>
        </View>

        {steps.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.eyebrowRow}>
                <Icon name="checklist" size={18} color={colors.secondary} />
                <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Step-by-Step Routine</Text>
              </View>
              <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
                {readyCount} of {steps.length} ready
              </Text>
            </View>
            <View style={{ gap: 10 }}>
              {steps.map((step, idx) => {
                const checked = Boolean(checkedSteps[idx]);
                return (
                  <Pressable
                    key={idx}
                    style={styles.stepRow}
                    onPress={() => setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                  >
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                      {checked ? <Icon name="check" size={14} color="#fff" /> : null}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.headlineSm, { color: colors.onSurface }]}>
                        {idx + 1}. {step.title}
                      </Text>
                      {step.description ? (
                        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>{step.description}</Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.alertCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Alert Configuration</Text>
              <Icon name="notifications" size={18} color={colors.onSurfaceVariant} />
            </View>
            <View style={styles.alertRow}>
              <Icon name="smartphone" size={18} color={colors.onSurfaceVariant} />
              <View style={{ flex: 1 }}>
                <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Push notification</Text>
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>Alert delivered 3 days prior</Text>
              </View>
              <StatusPill label="Active" />
            </View>
            <View style={styles.alertRow}>
              <Icon name="autorenew" size={18} color={colors.onSurfaceVariant} />
              <View style={{ flex: 1 }}>
                <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Repeat cadence</Text>
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>Auto-schedules next occurrence</Text>
              </View>
              <StatusPill label="Enabled" />
            </View>
          </View>
        </View>

        <View style={{ marginTop: spacing.spaceLg, gap: 12 }}>
          <PrimaryButton label="Mark as completed" icon="check_circle" onPress={handleComplete} loading={saving} />
          <SecondaryButton
            label="Reschedule reminder"
            icon="calendar_month"
            onPress={() => {
              setRescheduleDate(task.due_date ?? '');
              setRescheduleOpen(true);
            }}
          />
        </View>
      </ScrollView>

      <Modal visible={rescheduleOpen} transparent animationType="fade" onRequestClose={() => setRescheduleOpen(false)}>
        <View style={styles.rescheduleBackdrop}>
          <View style={styles.rescheduleModal}>
            <Text style={[typography.headlineSm, { color: colors.onSurface, marginBottom: 8 }]}>Reschedule reminder</Text>
            <TextInput
              value={rescheduleDate}
              onChangeText={setRescheduleDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.outline}
              style={styles.rescheduleInput}
            />
            <View style={styles.rescheduleActionsRow}>
              <View style={{ flex: 1 }}>
                <SecondaryButton label="Cancel" onPress={() => setRescheduleOpen(false)} />
              </View>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="Save" onPress={saveReschedule} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function DiagnosticCell({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.diagnosticCell}>
      <View style={styles.diagnosticLabelRow}>
        <Icon name={icon} size={14} color={colors.onSurfaceVariant} />
        <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>{label}</Text>
      </View>
      <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: 4, textTransform: 'capitalize' }]}>{value}</Text>
    </View>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <View style={styles.statusPill}>
      <Text style={[typography.labelSm, { color: colors.secondary, fontWeight: '600' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  windowBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.secondaryFixed, borderRadius: radius.xl, padding: spacing.spaceMd },
  windowIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.surfaceContainerLowest, alignItems: 'center', justifyContent: 'center' },
  dueChip: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  titleRow: { marginTop: spacing.spaceLg, flexDirection: 'row', alignItems: 'flex-start' },
  equipmentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.xl, padding: spacing.spaceMd, marginTop: spacing.spaceMd },
  section: { marginTop: spacing.spaceLg },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.spaceSm },
  routineBadge: { backgroundColor: colors.surfaceContainer, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  diagnosticsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  diagnosticCell: { width: '47%', backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.lg, padding: spacing.spaceMd },
  diagnosticLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.lg, padding: spacing.spaceMd },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxChecked: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  alertCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd, gap: 12 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusPill: { backgroundColor: colors.secondaryFixed, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  rescheduleBackdrop: { flex: 1, backgroundColor: 'rgba(11,28,48,0.4)', alignItems: 'center', justifyContent: 'center', padding: spacing.margin },
  rescheduleModal: { width: '100%', backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd },
  rescheduleInput: {
    height: 48,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 14,
    color: colors.onSurface,
  },
  rescheduleActionsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
});
