import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';
import { AppHeader, Icon, PrimaryButton } from '@/components';
import { useDeleteDocument, useDocument } from '@/hooks/useDocuments';
import { formatDateLong } from '@/lib/format';

export default function DocumentViewerScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: doc, isLoading } = useDocument(id);
  const deleteDocument = useDeleteDocument();

  if (isLoading || !doc) {
    return (
      <View style={[styles.center, { paddingTop: insets.top + 80 }]}>
        <ActivityIndicator color={colors.secondary} />
      </View>
    );
  }

  const isPdf = doc.mime_type === 'application/pdf';

  function handleDelete() {
    Alert.alert('Delete document', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!doc) return;
          await deleteDocument.mutateAsync({ id: doc.id, storagePath: doc.storage_path });
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title={doc.title} showBack avatarUrl={undefined} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32 }}>
        <View style={styles.previewWrap}>
          {isPdf ? (
            <View style={styles.pdfPlaceholder}>
              <Icon name="picture_as_pdf" size={40} color={colors.onSurfaceVariant} />
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 8 }]}>PDF document</Text>
            </View>
          ) : (
            <Image source={{ uri: doc.url }} style={StyleSheet.absoluteFill} contentFit="contain" />
          )}
        </View>

        <View style={styles.metaCard}>
          <MetaRow label="Type" value={doc.kind.replace('_', ' ')} />
          {doc.issued_date ? <MetaRow label="Issued" value={formatDateLong(doc.issued_date)} /> : null}
          {doc.expiry_date ? <MetaRow label="Expires" value={formatDateLong(doc.expiry_date)} /> : null}
          <MetaRow label="Size" value={`${(doc.file_size_bytes / 1024).toFixed(0)} KB`} />
        </View>

        <View style={{ marginTop: spacing.spaceLg }}>
          <PrimaryButton label="Delete document" icon="delete" variant="destructive" onPress={handleDelete} />
        </View>
      </ScrollView>
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={[typography.labelMd, { color: colors.onSurfaceVariant, textTransform: 'capitalize' }]}>{label}</Text>
      <Text style={[typography.bodyMd, { color: colors.onSurface, textTransform: 'capitalize' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  previewWrap: { height: 360, borderRadius: radius.xl, backgroundColor: colors.surfaceContainer, overflow: 'hidden' },
  pdfPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  metaCard: { marginTop: spacing.spaceLg, backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd, gap: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
