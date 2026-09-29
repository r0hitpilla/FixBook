import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, typography } from '@/theme';
import { Icon } from './Icon';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  icon?: string;
  error?: string;
}

// Deliberately does NOT track focus in React state. Re-rendering this
// component's wrapping View in response to the TextInput's own onFocus
// event (a synchronous style change on the ancestor of the input that just
// received focus) can cause the input to immediately blur again on some
// React Native "New Architecture" builds — the keyboard flashes open and
// shuts a moment later. A static border avoids that class of bug entirely.
export function TextField({ label, icon, error, style, ...rest }: TextFieldProps) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={[typography.labelMd, { color: colors.onSurfaceVariant }]}>{label}</Text> : null}
      <View style={[styles.wrap, error ? styles.wrapError : null]}>
        {icon ? <Icon name={icon} size={18} color={colors.onSurfaceVariant} /> : null}
        <TextInput placeholderTextColor={colors.outline} style={[styles.input, style]} {...rest} />
      </View>
      {error ? <Text style={[typography.bodySm, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 48,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  wrapError: {
    borderColor: colors.error,
  },
  input: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
    height: '100%',
  },
});
