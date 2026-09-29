import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/theme';
import { Icon } from './Icon';
import { useIsOnline } from '@/hooks/useIsOnline';

export function OfflineBanner() {
  const isOnline = useIsOnline();
  const insets = useSafeAreaInsets();
  if (isOnline) return null;
  return (
    <View style={[styles.wrap, { top: insets.top + 4 }]} pointerEvents="none">
      <Icon name="cloud_off" size={14} color="#fff" />
      <Text style={[typography.labelSm, { color: '#fff' }]}>Offline — changes will sync automatically</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.onSurface,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
});
