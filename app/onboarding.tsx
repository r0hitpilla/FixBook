import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { Icon, PrimaryButton } from '@/components';
import { ONBOARDED_KEY } from './index';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCeVZQ05Fb9jFFO6dsoe1F0C9qk2xUNKRFbPK4MYNvKA6zcuZoMx8Nh_pX2d2XfnbVgVWy17wC7UObv6ihpF6muuKg2QmblwosmFLxrIEa3_zERaY2_5NFGjW2jQfrqXDi8vSA4d23aocpT_JLlJh-eCS6cCKyMQeJ78vAAfmrW5pmxR5LF1VhA7XMRQSNBbyfq-yjAkOlTCn_mpmIB51KQFpIZQvRgqYP18dg_Stsf6ONbnmrAuIrc';

const TABS = [
  { key: 'hub', label: 'Asset Hub' },
  { key: 'photo', label: 'Just take a photo' },
  { key: 'care', label: 'Never miss care' },
] as const;

const FEATURES = [
  {
    icon: 'receipt_long',
    title: 'AI Scan Invoices & Receipts',
    subtitle: 'Extract serial numbers, dates, and warranties automatically',
    bg: 'rgba(49,107,243,0.1)',
    color: colors.secondary,
  },
  {
    icon: 'notifications_active',
    title: 'Proactive Maintenance Schedules',
    subtitle: 'Know precisely when to descale, lube, service, or clean',
    bg: colors.surfaceContainerHighest,
    color: colors.onSurfaceVariant,
  },
  {
    icon: 'security_update_good',
    title: 'Instant Warranty Expiry Alerts',
    subtitle: 'Catch warranty claims weeks before they quietly slip away',
    bg: 'rgba(111,251,190,0.5)',
    color: colors.onTertiaryFixedVariant,
  },
];

async function finishOnboarding(destination: '/(auth)/signup' | '/(auth)/login') {
  await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
  router.replace(destination);
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['key']>('hub');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }}
    >
      <View style={styles.topRow}>
        <View style={styles.pillsRow}>
          {TABS.map((tab) => (
            <View key={tab.key} style={[styles.pill, { width: activeTab === tab.key ? 32 : 10 }]} />
          ))}
        </View>
        <Pressable onPress={() => finishOnboarding('/(auth)/login')} hitSlop={8}>
          <Text style={[typography.labelLg, { color: colors.onSurfaceVariant }]}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.heroWrap}>
        <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} contentFit="cover" transition={200} />
        <View style={styles.heroTintOverlay} />

        <View style={styles.tagTopLeft}>
          <View style={styles.tagIconWrap}>
            <Icon name="coffee_maker" size={18} color={colors.secondary} />
          </View>
          <View>
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>
              Espresso Unit
            </Text>
            <Text style={[typography.labelMd, { color: colors.onSurface }]}>● Filter Clean Due</Text>
          </View>
        </View>

        <View style={styles.tagBottomRight}>
          <View style={[styles.tagIconWrap, { backgroundColor: 'rgba(111,251,190,0.4)' }]}>
            <Icon name="verified_user" size={18} color={colors.onTertiaryFixedVariant} />
          </View>
          <View>
            <Text style={[typography.labelSm, { color: colors.onSurfaceVariant, textTransform: 'uppercase' }]}>
              Lens 50mm f/1.2
            </Text>
            <Text style={[typography.labelMd, { color: colors.onSurface }]}>Warranty active · 24mo</Text>
          </View>
        </View>

        <View style={styles.tagBottomLeft}>
          <Icon name="document_scanner" size={14} color={colors.onSecondaryContainer} />
          <Text style={[typography.labelSm, { color: colors.onSecondaryContainer, fontWeight: '600' }]}>
            Receipt Digitized
          </Text>
        </View>
      </View>

      <View style={styles.narrativeBlock}>
        <View style={styles.eyebrowPill}>
          <Icon name="inventory_2" size={15} color={colors.onSecondaryFixed} />
          <Text style={[typography.labelSm, { color: colors.onSecondaryFixed, textTransform: 'uppercase' }]}>
            Asset Intelligence
          </Text>
        </View>
        <Text style={[typography.headlineXl, { color: colors.onSurface, textAlign: 'center', marginTop: 12 }]}>
          Your stuff deserves a memory.
        </Text>
        <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }]}>
          FixBook keeps track of the things you own, maintain, and care about in one private, effortless place.
        </Text>
      </View>

      <View style={styles.featureDeck}>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.featureRow}>
            <View style={[styles.featureIconWrap, { backgroundColor: f.bg }]}>
              <Icon name={f.icon} size={20} color={f.color} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[typography.headlineSm, { color: colors.onSurface }]} numberOfLines={1}>
                {f.title}
              </Text>
              <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                {f.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tabButton, active && { backgroundColor: colors.surfaceContainerHigh }]}
            >
              <View style={[styles.tabDot, { backgroundColor: active ? colors.secondaryContainer : colors.outlineVariant }]} />
              <Text style={[typography.labelSm, { color: active ? colors.onSurface : colors.onSurfaceVariant, fontWeight: active ? '600' : '400' }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.ctaBlock}>
        <PrimaryButton
          label="Get Started"
          icon="arrow_forward"
          variant="accent"
          onPress={() => finishOnboarding('/(auth)/signup')}
        />
        <View style={styles.loginRow}>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>Already using FixBook?</Text>
          <Pressable onPress={() => finishOnboarding('/(auth)/login')} hitSlop={8}>
            <Text style={[typography.labelMd, { color: colors.secondary, fontWeight: '600' }]}> Log in</Text>
          </Pressable>
        </View>
        <View style={styles.trustRow}>
          <Icon name="lock" size={14} color={colors.onSurfaceVariant} />
          <Text style={[typography.labelSm, { color: colors.onSurfaceVariant }]}>
            Encrypted & Private · No Ads · Local-first sync
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    marginBottom: 12,
  },
  pillsRow: { flexDirection: 'row', gap: 6 },
  pill: { height: 6, borderRadius: 3, backgroundColor: colors.secondaryContainer },
  heroWrap: {
    marginHorizontal: spacing.margin,
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  heroImage: { ...StyleSheet.absoluteFill },
  heroTintOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(19,27,46,0.04)' },
  tagIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagTopLeft: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 10,
  },
  tagBottomRight: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 10,
  },
  tagBottomLeft: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryContainer,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  narrativeBlock: { alignItems: 'center', paddingHorizontal: spacing.margin, paddingTop: 12 },
  eyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryFixed,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  featureDeck: {
    marginHorizontal: spacing.margin,
    marginTop: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239,244,255,0.7)',
  },
  featureIconWrap: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tabsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  tabButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  tabDot: { width: 8, height: 8, borderRadius: 4 },
  ctaBlock: { paddingHorizontal: spacing.margin, marginTop: 12, gap: 12, alignItems: 'center' },
  loginRow: { flexDirection: 'row', alignItems: 'center' },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
});
