import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { Icon } from './Icon';

export interface AppHeaderProps {
  title: string;
  eyebrow?: string;
  showBack?: boolean;
  avatarUrl?: string | null;
  onAvatarPress?: () => void;
  rightActions?: { icon: string; onPress: () => void; badge?: boolean }[];
  transparent?: boolean;
}

export function AppHeader({ title, eyebrow, showBack, avatarUrl, onAvatarPress, rightActions = [], transparent }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.wrap,
        { paddingTop: insets.top, backgroundColor: transparent ? 'transparent' : 'rgba(248,249,255,0.9)' },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.leading}>
          {showBack ? (
            <Pressable onPress={() => router.back()} hitSlop={8} style={styles.iconButton}>
              <Icon name="arrow_back" size={24} color={colors.onSurface} />
            </Pressable>
          ) : null}
          <View style={{ minWidth: 0 }}>
            {eyebrow ? (
              <Text style={[typography.labelSm, { color: colors.secondary, textTransform: 'uppercase' }]}>{eyebrow}</Text>
            ) : null}
            <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </View>
        <View style={styles.trailing}>
          {rightActions.map((action, idx) => (
            <Pressable key={idx} onPress={action.onPress} hitSlop={8} style={styles.iconButton}>
              <Icon name={action.icon} size={22} color={colors.onSurfaceVariant} />
              {action.badge ? <View style={styles.badgeDot} /> : null}
            </Pressable>
          ))}
          {avatarUrl !== undefined ? (
            <Pressable onPress={onAvatarPress} style={styles.avatarWrap}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Icon name="account_circle" size={22} color={colors.onSurfaceVariant} />
                </View>
              )}
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  row: {
    height: 64,
    paddingHorizontal: spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.spaceSm,
  },
  leading: { flexDirection: 'row', alignItems: 'center', gap: spacing.spaceXs, flexShrink: 1, minWidth: 0 },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: spacing.space2xs },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  badgeDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondary },
  avatarWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarPlaceholder: { backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
});
