import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';
import { AppHeader, Icon, PrimaryButton, SecondaryButton } from '@/components';
import { useSubscription } from '@/hooks/useProfile';

const PLANS = [
  { id: 'free', name: 'Free', price: '₹0', period: 'forever', features: ['Up to 15 assets', 'Manual entry', 'Basic reminders'] },
  { id: 'plus', name: 'Plus', price: '₹149', period: '/month', features: ['Unlimited assets', 'AI receipt scanning', 'Warranty & document alerts'] },
  { id: 'pro', name: 'Pro', price: '₹349', period: '/month', features: ['Everything in Plus', 'Priority AI extraction', 'Export & backups'] },
] as const;

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const { data: subscription } = useSubscription();

  function handleUpgrade(planId: string) {
    if (planId === subscription?.plan) return;
    Alert.alert(
      'Upgrades coming soon',
      'In-app billing isn’t wired up yet in this build. Reach out to support@fixbook.app to upgrade your plan manually.'
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <AppHeader title="Subscription" showBack avatarUrl={undefined} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 76, paddingHorizontal: spacing.margin, paddingBottom: insets.bottom + 32, gap: 16 }}>
        {PLANS.map((plan) => {
          const isCurrent = subscription?.plan === plan.id;
          return (
            <View key={plan.id} style={[styles.card, isCurrent && styles.cardActive]}>
              <View style={styles.headerRow}>
                <Text style={[typography.headlineMd, { color: colors.onSurface }]}>{plan.name}</Text>
                {isCurrent ? (
                  <View style={styles.currentBadge}>
                    <Text style={[typography.labelSm, { color: colors.secondary, fontWeight: '600' }]}>CURRENT PLAN</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.priceRow}>
                <Text style={[typography.headlineXl, { color: colors.onSurface }]}>{plan.price}</Text>
                <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>{plan.period}</Text>
              </View>
              <View style={{ gap: 8, marginTop: 12 }}>
                {plan.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Icon name="check_circle" size={16} color={colors.secondary} />
                    <Text style={[typography.bodySm, { color: colors.onSurface }]}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={{ marginTop: 16 }}>
                {isCurrent ? (
                  <SecondaryButton label="Your current plan" onPress={() => {}} disabled />
                ) : (
                  <PrimaryButton label={`Switch to ${plan.name}`} variant="accent" onPress={() => handleUpgrade(plan.id)} />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl, padding: spacing.spaceMd, borderWidth: 1, borderColor: colors.outlineVariant },
  cardActive: { borderColor: colors.secondary, borderWidth: 1.5 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  currentBadge: { backgroundColor: colors.secondaryFixed, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
