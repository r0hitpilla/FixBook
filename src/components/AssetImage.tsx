import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius } from '@/theme';
import { Icon } from './Icon';
import { categoryIcon } from '@/constants/categories';

export interface AssetImageProps {
  uri?: string | null;
  category?: string;
  size?: number;
  borderRadius?: number;
}

export function AssetImage({ uri, category, size = 56, borderRadius = radius.lg }: AssetImageProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius }]}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name={categoryIcon(category)} size={size * 0.4} color={colors.onSurfaceVariant} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
