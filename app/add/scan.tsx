import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';
import { Icon, PrimaryButton } from '@/components';
import { useAddFlowStore, type ScanDocKind } from '@/store/addFlow';
import { extractDocumentFields } from '@/lib/extraction';

const DOC_TABS: { key: ScanDocKind; label: string }[] = [
  { key: 'invoice', label: 'Invoice' },
  { key: 'warranty_card', label: 'Warranty Card' },
  { key: 'product_label', label: 'Serial Label' },
];

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const docKind = useAddFlowStore((s) => s.docKind);
  const setDocKind = useAddFlowStore((s) => s.setDocKind);
  const setCapture = useAddFlowStore((s) => s.setCapture);
  const setExtracted = useAddFlowStore((s) => s.setExtracted);
  const [torch, setTorch] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Position document in frame');
  const [error, setError] = useState<string | null>(null);

  async function runExtraction(uri: string, mimeType: string) {
    setCapture(uri, mimeType);
    setProcessing(true);
    setError(null);
    setStatusText('Understanding document...');
    try {
      const result = await extractDocumentFields(uri, mimeType, docKind);
      setExtracted(result.fields);
      router.replace('/add/review');
    } catch (e: any) {
      setError(e?.message ?? 'Could not read this document. You can still enter details manually.');
      setExtracted(null);
    } finally {
      setProcessing(false);
    }
  }

  async function handleCapture() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, base64: false });
    if (photo?.uri) await runExtraction(photo.uri, 'image/jpeg');
  }

  async function handleImport() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (result.canceled || !result.assets?.[0]) return;
    await runExtraction(result.assets[0].uri, result.assets[0].mimeType ?? 'image/jpeg');
  }

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionWrap]}>
        <Icon name="qr_code_scanner" size={40} color={colors.onSurfaceVariant} />
        <Text style={[typography.headlineSm, { color: colors.onSurface, marginTop: 16, textAlign: 'center' }]}>
          FixBook needs camera access to scan documents
        </Text>
        <View style={{ marginTop: 20, width: '80%' }}>
          <PrimaryButton label="Enable camera" onPress={requestPermission} />
        </View>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={[typography.labelMd, { color: colors.secondary }]}>Add manually instead</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} />
      <View style={[styles.overlayTop, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <Pressable onPress={() => setTorch((t) => !t)} style={styles.circleButton}>
            <Icon name={torch ? 'flash_on' : 'flash_off'} size={20} color="#fff" />
          </Pressable>
          <View style={styles.tabsRow}>
            {DOC_TABS.map((tab) => {
              const active = docKind === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setDocKind(tab.key)}
                  style={[styles.tabPill, active && { backgroundColor: colors.secondaryContainer }]}
                >
                  <Text style={[typography.labelSm, { color: '#fff' }]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable onPress={() => router.back()} style={styles.circleButton}>
            <Icon name="close" size={20} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={[typography.labelSm, { color: '#fff' }]}>{statusText}</Text>
        </View>
      </View>

      <View pointerEvents="none" style={styles.frameGuide}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 20 }]}>
        {processing ? (
          <View style={styles.processingRow}>
            <ActivityIndicator color={colors.secondary} />
            <Text style={[typography.headlineSm, { color: colors.onSurface, flex: 1 }]}>Understanding document...</Text>
          </View>
        ) : error ? (
          <Text style={[typography.bodySm, { color: colors.error, marginBottom: 8 }]}>{error}</Text>
        ) : null}

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionButton} onPress={handleImport}>
            <Icon name="photo_library" size={24} color={colors.onSurfaceVariant} />
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>Import</Text>
          </Pressable>
          <Pressable
            style={[styles.shutterButton, processing && { opacity: 0.5 }]}
            disabled={processing}
            onPress={handleCapture}
          >
            <Icon name="document_scanner" size={28} color="#fff" />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/add/manual')}>
            <Icon name="edit_note" size={24} color={colors.onSurfaceVariant} />
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>Manual</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionWrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.margin, backgroundColor: colors.surface },
  overlayTop: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: spacing.margin, gap: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  circleButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  tabsRow: { flexDirection: 'row', gap: 6, flex: 1, justifyContent: 'center' },
  tabPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.4)' },
  statusPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34d399' },
  frameGuide: { position: 'absolute', top: '25%', left: '8%', right: '8%', bottom: '32%' },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: colors.secondaryContainer },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.margin,
  },
  processingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.spaceMd },
  actionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  actionButton: { alignItems: 'center', gap: 4, minWidth: 64 },
  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.onSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
