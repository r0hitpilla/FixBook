import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';
import { AppHeader, CategoryField, PrimaryButton, TextField } from '@/components';
import { useCreateAsset } from '@/hooks/useAssets';

export default function AddManuallyScreen() {
  const insets = useSafeAreaInsets();
  const createAsset = useCreateAsset();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [saving, setSaving] = useState(false);

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
        brand: brand.trim() || null,
        model: model.trim() || null,
        serial_number: serial.trim() || null,
        purchase_date: purchaseDate || null,
        purchase_price: purchasePrice ? Number(purchasePrice) : null,
      });
      router.replace(`/asset/${asset.id}`);
    } catch (e: any) {
      Alert.alert('Could not save', e?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Add Manually" showBack avatarUrl={undefined} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32, gap: 16 }}
      >
        <TextField label="Asset Name" value={name} onChangeText={setName} placeholder="e.g. Honda CB350" />
        <CategoryField value={category} onChange={setCategory} />
        <TextField label="Brand" value={brand} onChangeText={setBrand} placeholder="Honda" />
        <TextField label="Model" value={model} onChangeText={setModel} placeholder="CB350 H'ness" />
        <TextField label="Serial / Registration Number" value={serial} onChangeText={setSerial} placeholder="DL 01 AB 4092" />
        <TextField label="Purchase Date" icon="calendar_today" value={purchaseDate} onChangeText={setPurchaseDate} placeholder="YYYY-MM-DD" />
        <TextField
          label="Purchase Price"
          icon="payments"
          value={purchasePrice}
          onChangeText={setPurchasePrice}
          placeholder="240000"
          keyboardType="numeric"
        />
        <PrimaryButton label="Save to FixBook" onPress={handleSave} loading={saving} />
      </ScrollView>
    </View>
  );
}
