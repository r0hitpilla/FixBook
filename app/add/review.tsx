import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';
import { AppHeader, CategoryField, Icon, PrimaryButton, TextField } from '@/components';
import { useAddFlowStore } from '@/store/addFlow';
import { useCreateAsset } from '@/hooks/useAssets';
import { useUploadDocument } from '@/hooks/useDocuments';
import { useCreateWarranty } from '@/hooks/useWarranties';

export default function ReviewExtractionScreen() {
  const insets = useSafeAreaInsets();
  const { photoUri, mimeType, docKind, extracted, reset } = useAddFlowStore();
  const createAsset = useCreateAsset();
  const uploadDocument = useUploadDocument();
  const createWarranty = useCreateWarranty();

  const [name, setName] = useState(extracted?.product ?? '');
  const [category, setCategory] = useState(extracted?.category ?? 'other');
  const [model, setModel] = useState(extracted?.model ?? '');
  const [serial, setSerial] = useState(extracted?.serial_number ?? '');
  const [purchaseDate, setPurchaseDate] = useState(extracted?.purchase_date ?? '');
  const [purchasePrice, setPurchasePrice] = useState(extracted?.purchase_price?.toString() ?? '');
  const [seller, setSeller] = useState(extracted?.seller ?? '');
  const [warrantyMonths, setWarrantyMonths] = useState(extracted?.warranty_months?.toString() ?? '');
  const [routineReminder, setRoutineReminder] = useState(true);
  const [warrantyAlert, setWarrantyAlert] = useState(true);
  const [saving, setSaving] = useState(false);

  const fieldsFound = Object.values(extracted ?? {}).filter((v) => v !== null && v !== undefined && v !== '').length;
  const confidence = extracted ? Math.min(98, 60 + fieldsFound * 5) : 0;

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give this asset a name before saving.');
      return;
    }
    setSaving(true);
    try {
      const asset = await createAsset.mutateAsync({
        name: name.trim(),
        category,
        model: model.trim() || null,
        serial_number: serial.trim() || null,
        purchase_date: purchaseDate || null,
        purchase_price: purchasePrice ? Number(purchasePrice) : null,
      });

      let documentId: string | undefined;
      if (photoUri && mimeType) {
        const info = await FileSystem.getInfoAsync(photoUri);
        const fileSizeBytes = info.exists ? (info.size ?? 0) : 0;
        const doc = await uploadDocument.mutateAsync({
          assetId: asset.id,
          kind: docKind,
          title: seller ? `${docKind.replace('_', ' ')} — ${seller}` : name,
          localUri: photoUri,
          mimeType,
          fileSizeBytes,
          extractedFields: extracted ?? null,
        });
        documentId = doc.id;
      }

      if (warrantyAlert && warrantyMonths && purchaseDate) {
        const start = new Date(purchaseDate);
        const expiry = new Date(start);
        expiry.setMonth(expiry.getMonth() + Number(warrantyMonths));
        await createWarranty.mutateAsync({
          assetId: asset.id,
          provider: seller || null,
          coverageSummary: `${warrantyMonths} month warranty`,
          startDate: purchaseDate,
          expiryDate: expiry.toISOString().slice(0, 10),
          documentId,
        });
      }

      reset();
      router.replace(`/asset/${asset.id}`);
    } catch (e: any) {
      Alert.alert('Could not save', e?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    reset();
    router.replace('/(tabs)');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Maintenance Review" showBack avatarUrl={undefined} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32 }}>
        <View style={styles.confidenceBanner}>
          <View style={{ flex: 1 }}>
            <View style={styles.confidenceBadge}>
              <Icon name="auto_awesome" size={14} color="#fff" />
              <Text style={[typography.labelSm, { color: '#fff' }]}>
                {extracted ? `${fieldsFound} DETAILS DETECTED` : 'MANUAL ENTRY'}
              </Text>
            </View>
            <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: 8 }]}>
              {extracted ? 'Ready for verification' : 'Fill in the details'}
            </Text>
            <View style={styles.confidenceRow}>
              <View style={styles.liveDot} />
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>
                {extracted ? `${confidence}% Confidence · On-device secure OCR` : 'Nothing was auto-filled — enter details below'}
              </Text>
            </View>
          </View>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.thumb} contentFit="cover" />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]}>
              <Icon name="description" size={20} color={colors.onSurfaceVariant} />
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={[typography.labelMd, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>Asset Name</Text>
            {extracted?.product ? (
              <View style={styles.autoPill}>
                <Icon name="check_circle" size={12} color={colors.secondary} />
                <Text style={[typography.labelSm, { color: colors.secondary }]}>Auto-Extracted</Text>
              </View>
            ) : null}
          </View>
          <TextField value={name} onChangeText={setName} placeholder="e.g. Samsung Front Load Washing Machine" />
        </View>

        <View style={styles.fieldGroup}>
          <CategoryField value={category} onChange={setCategory} />
        </View>

        <View style={styles.row}>
          <View style={styles.flexField}>
            <TextField label="Model No." value={model} onChangeText={setModel} placeholder="WW90T554DAN" />
          </View>
          <View style={styles.flexField}>
            <TextField label="Serial ID" value={serial} onChangeText={setSerial} placeholder="847291038592A" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.flexField}>
            <TextField label="Purchase Date" icon="calendar_today" value={purchaseDate} onChangeText={setPurchaseDate} placeholder="YYYY-MM-DD" />
          </View>
          <View style={styles.flexField}>
            <TextField
              label="Purchase Amount"
              icon="payments"
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="42999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <TextField label="Merchant / Retailer" icon="storefront" value={seller} onChangeText={setSeller} placeholder="Croma, Indiranagar Flagship" />
        </View>

        <View style={[styles.fieldGroup, styles.warrantyCard]}>
          <View style={styles.labelRow}>
            <View style={styles.eyebrowRow}>
              <Icon name="shield" size={16} color={colors.onSurfaceVariant} />
              <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Warranty</Text>
            </View>
          </View>
          <TextField
            value={warrantyMonths}
            onChangeText={setWarrantyMonths}
            placeholder="Warranty length in months"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.routinesCard}>
          <View style={styles.eyebrowRow}>
            <Icon name="tips_and_updates" size={18} color={colors.secondary} />
            <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Smart Maintenance Routines</Text>
          </View>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Maintenance reminders</Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>Get notified based on typical service cycles</Text>
            </View>
            <Switch value={routineReminder} onValueChange={setRoutineReminder} trackColor={{ true: colors.secondaryContainer }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]}>Warranty expiration alert</Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>Notify 30 days before coverage ends</Text>
            </View>
            <Switch value={warrantyAlert} onValueChange={setWarrantyAlert} trackColor={{ true: colors.secondaryContainer }} />
          </View>
        </View>

        <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.spaceLg }]}>
          Never irreversible — specs and receipts can be modified anytime.
        </Text>

        <View style={{ marginTop: spacing.spaceMd }}>
          <PrimaryButton label="Save to FixBook" icon="check_circle" onPress={handleSave} loading={saving} />
        </View>
        <Pressable onPress={handleDiscard}>
          <Text style={[typography.labelMd, { color: colors.error, textAlign: 'center', marginTop: 16 }]}>Discard Scan</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  confidenceBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    padding: spacing.spaceMd,
    marginBottom: spacing.spaceLg,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.onSurface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.secondary },
  thumb: { width: 56, height: 72, borderRadius: 8, backgroundColor: colors.surfaceContainer },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  fieldGroup: { marginBottom: spacing.spaceMd },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  autoPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.secondaryFixed, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  row: { flexDirection: 'row', gap: 12, marginBottom: spacing.spaceMd },
  flexField: { flex: 1 },
  warrantyCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routinesCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd, gap: spacing.spaceSm },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  divider: { height: 1, backgroundColor: colors.surfaceContainer },
});
