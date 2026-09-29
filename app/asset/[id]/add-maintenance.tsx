import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';
import { AppHeader, PrimaryButton, TextField } from '@/components';
import { useCreateMaintenanceRecord } from '@/hooks/useMaintenance';

export default function AddMaintenanceScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const createRecord = useCreateMaintenanceRecord();
  const [title, setTitle] = useState('');
  const [performedAt, setPerformedAt] = useState(new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!id || !title.trim() || !performedAt) {
      Alert.alert('Missing details', 'Add at least a title and service date.');
      return;
    }
    setSaving(true);
    try {
      await createRecord.mutateAsync({
        asset_id: id,
        title: title.trim(),
        performed_at: performedAt,
        odometer_km: odometer ? Number(odometer) : null,
        cost: cost ? Number(cost) : null,
        service_provider: provider.trim() || null,
        notes: notes.trim() || null,
        invoice_reference: invoiceRef.trim() || null,
        document_id: null,
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Could not save', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Log Service Record" showBack avatarUrl={undefined} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32, gap: 16 }}
      >
        <TextField label="What was done" value={title} onChangeText={setTitle} placeholder="Engine oil & filter replaced" />
        <TextField label="Service Date" icon="calendar_today" value={performedAt} onChangeText={setPerformedAt} placeholder="YYYY-MM-DD" />
        <TextField label="Odometer (km)" icon="speed" value={odometer} onChangeText={setOdometer} keyboardType="numeric" placeholder="17200" />
        <TextField label="Cost" icon="payments" value={cost} onChangeText={setCost} keyboardType="numeric" placeholder="1250" />
        <TextField label="Service Provider" icon="storefront" value={provider} onChangeText={setProvider} placeholder="BigWing Service" />
        <TextField label="Invoice Reference" icon="receipt_long" value={invoiceRef} onChangeText={setInvoiceRef} placeholder="BW-8891" />
        <TextField label="Notes" value={notes} onChangeText={setNotes} placeholder="Parts used, observations, next steps" multiline style={{ minHeight: 80 }} />
        <PrimaryButton label="Save service record" onPress={handleSave} loading={saving} />
      </ScrollView>
    </View>
  );
}
