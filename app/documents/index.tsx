import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { AppHeader, Card, EmptyState, Icon } from '@/components';
import { useDocuments } from '@/hooks/useDocuments';
import { formatDateShort } from '@/lib/format';

const KIND_ICON: Record<string, string> = {
  invoice: 'receipt_long',
  warranty_card: 'workspace_premium',
  product_label: 'qr_code_scanner',
  insurance: 'shield',
  vehicle_doc: 'badge',
  service_receipt: 'receipt_long',
  purchase_receipt: 'receipt_long',
  other: 'description',
};

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  const { data: documents, isLoading } = useDocuments();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Documents" showBack avatarUrl={undefined} rightActions={[{ icon: 'add', onPress: () => router.push('/add') }]} />
      <FlatList
        data={documents ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32, gap: 12 }}
        renderItem={({ item }) => (
          <Card onPress={() => router.push(`/documents/${item.id}`)}>
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <Icon name={KIND_ICON[item.kind] ?? 'description'} size={20} color={colors.onSurface} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                  {item.kind.replace('_', ' ')} · {formatDateShort(item.created_at)}
                </Text>
              </View>
              {item.expiry_date ? (
                <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>Exp {formatDateShort(item.expiry_date)}</Text>
              ) : null}
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="description"
              title="No documents yet"
              subtitle="Scan a receipt, warranty card, or vehicle document to store it here."
              actionLabel="Scan a document"
              onAction={() => router.push('/add')}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
});
