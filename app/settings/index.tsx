import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { AppHeader, Card, Icon } from '@/components';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/auth';

const PREF_ROWS: { key: 'maintenance' | 'warranty' | 'insurance' | 'documents'; icon: string; label: string; subtitle: string }[] = [
  { key: 'maintenance', icon: 'build_circle', label: 'Maintenance reminders', subtitle: 'Upcoming service and repair tasks' },
  { key: 'warranty', icon: 'workspace_premium', label: 'Warranty expiry', subtitle: 'Alerts before coverage ends' },
  { key: 'insurance', icon: 'shield', label: 'Insurance expiry', subtitle: 'Alerts before policies lapse' },
  { key: 'documents', icon: 'description', label: 'Document expiry', subtitle: 'RC renewals, AMC, and more' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const session = useAuthStore((s) => s.session);

  function togglePref(key: (typeof PREF_ROWS)[number]['key'], value: boolean) {
    if (!profile) return;
    updateProfile.mutate({ notification_prefs: { ...profile.notification_prefs, [key]: value } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Settings" showBack avatarUrl={undefined} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32 }}>
        <Text style={[typography.labelMd, { color: colors.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 8 }]}>
          Notifications
        </Text>
        <Card style={{ gap: 4 }}>
          {PREF_ROWS.map((row, idx) => (
            <View key={row.key}>
              <View style={styles.row}>
                <Icon name={row.icon} size={20} color={colors.onSurfaceVariant} />
                <View style={{ flex: 1 }}>
                  <Text style={[typography.headlineSm, { color: colors.onSurface }]}>{row.label}</Text>
                  <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>{row.subtitle}</Text>
                </View>
                <Switch
                  value={profile?.notification_prefs[row.key] ?? true}
                  onValueChange={(value) => togglePref(row.key, value)}
                  trackColor={{ true: colors.secondaryContainer }}
                />
              </View>
              {idx < PREF_ROWS.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </Card>

        <Text style={[typography.labelMd, { color: colors.onSurfaceVariant, textTransform: 'uppercase', marginTop: spacing.spaceLg, marginBottom: 8 }]}>
          Account
        </Text>
        <Card>
          <View style={styles.row}>
            <Icon name="mail" size={20} color={colors.onSurfaceVariant} />
            <Text style={[typography.bodyMd, { color: colors.onSurface }]}>{session?.user.email}</Text>
          </View>
        </Card>

        <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.spaceXl }]}>
          FixBook v{Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  divider: { height: 1, backgroundColor: colors.surfaceContainer },
});
