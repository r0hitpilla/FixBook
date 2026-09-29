import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { Icon } from './Icon';
import { CATEGORY_LIST, categoryIcon, categoryLabel } from '@/constants/categories';

export interface CategoryFieldProps {
  value: string;
  onChange: (category: string) => void;
  label?: string;
}

export function CategoryField({ value, onChange, label = 'Category' }: CategoryFieldProps) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={[typography.labelMd, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Text style={[typography.bodyMd, { color: colors.onSurface }]}>{categoryLabel(value)}</Text>
        <Icon name="expand_more" size={20} color={colors.onSurfaceVariant} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {CATEGORY_LIST.map((category) => (
              <Pressable
                key={category}
                style={styles.option}
                onPress={() => {
                  onChange(category);
                  setOpen(false);
                }}
              >
                <Icon name={categoryIcon(category)} size={20} color={colors.onSurface} />
                <Text style={[typography.bodyMd, { color: colors.onSurface }]}>{categoryLabel(category)}</Text>
                {value === category ? <Icon name="check" size={18} color={colors.secondary} style={{ marginLeft: 'auto' }} /> : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 48,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(11,28,48,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surfaceContainerLowest, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.margin, gap: 4 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
});
