import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, typography } from '@/theme';
import { Icon } from './Icon';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  icon?: string;
  error?: string;
}

export function TextField({ label, icon, error, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={[typography.labelMd, { color: colors.onSurfaceVariant }]}>{label}</Text> : null}
      <View
        style={[
          styles.wrap,
          focused && styles.wrapFocused,
          error ? { borderColor: colors.error } : null,
        ]}
      >
        {icon ? <Icon name={icon} size={18} color={colors.onSurfaceVariant} /> : null}
        <TextInput
          placeholderTextColor={colors.outline}
          style={[typography.bodyMd, styles.input, { color: colors.onSurface }, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
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
  wrapFocused: {
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  input: { flex: 1, height: '100%' },
});
