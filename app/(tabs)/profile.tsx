import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { Card, Icon } from '@/components';
import { useProfile, useSubscription } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';

const MENU: { icon: string; label: string; onPress: () => void }[] = [
  { icon: 'inventory_2', label: 'My Assets', onPress: () => router.push('/(tabs)/assets') },
  { icon: 'description', label: 'Documents', onPress: () => router.push('/documents') },
  { icon: 'workspace_premium', label: 'Subscription', onPress: () => router.push('/subscription') },
  { icon: 'settings', label: 'Settings', onPress: () => router.push('/settings') },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile();
  const { data: subscription } = useSubscription();
  const session = useAuthStore((s) => s.session);

  async function handleSignOut() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 96, paddingHorizontal: spacing.margin }}
    >
      <View style={styles.header}>
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Icon name="account_circle" size={32} color={colors.onSurfaceVariant} />
          </View>
        )}
        <Text style={[typography.headlineMd, { color: colors.onSurface, marginTop: 12 }]}>
          {profile?.full_name ?? 'FixBook user'}
        </Text>
        <Text style={[typography.bodySm, { color: colors.onSurfaceVariant, marginTop: 2 }]}>{session?.user.email}</Text>
        <View style={styles.planPill}>
          <Icon name="workspace_premium" size={14} color={colors.onSecondaryFixedVariant} />
          <Text style={[typography.labelSm, { color: colors.onSecondaryFixedVariant, textTransform: 'capitalize' }]}>
            {subscription?.plan ?? 'free'} plan
          </Text>
        </View>
      </View>

      <View style={{ marginTop: spacing.spaceXl, gap: 12 }}>
        {MENU.map((item) => (
          <Card key={item.label} onPress={item.onPress} style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Icon name={item.icon} size={20} color={colors.onSurfaceVariant} />
              <Text style={[typography.headlineSm, { color: colors.onSurface }]}>{item.label}</Text>
            </View>
            <Icon name="chevron_right" size={18} color={colors.outlineVariant} />
          </Card>
        ))}
        <Card onPress={handleSignOut} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Icon name="logout" size={20} color={colors.error} />
            <Text style={[typography.headlineSm, { color: colors.error }]}>Log out</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center' },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarPlaceholder: { backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  planPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.secondaryFixed,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
