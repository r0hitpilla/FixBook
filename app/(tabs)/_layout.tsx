import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '@/theme';
import { Icon } from '@/components';
import { useNotificationSync } from '@/hooks/useNotificationSync';

const TAB_META: Record<string, { icon: string; label: string }> = {
  index: { icon: 'grid_view', label: 'Home' },
  assets: { icon: 'inventory_2', label: 'Assets' },
  activity: { icon: 'monitoring', label: 'Activity' },
  profile: { icon: 'account_circle', label: 'Profile' },
};

type TabBarProps = NonNullable<React.ComponentProps<typeof Tabs>['tabBar']> extends (props: infer P) => any ? P : never;

function CustomTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  const renderTab = (route: (typeof state.routes)[number], index: number) => {
    const meta = TAB_META[route.name] ?? { icon: 'circle', label: route.name };
    const isFocused = state.index === state.routes.indexOf(route);
    const color = isFocused ? colors.secondary : colors.onSurfaceVariant;
    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        }}
        style={styles.tab}
      >
        <Icon name={meta.icon} size={22} color={color} />
        <Text style={[typography.labelSm, { color, marginTop: 2 }]}>{meta.label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      <View style={styles.row}>
        {leftRoutes.map(renderTab)}
        <View style={styles.fabSlot}>
          <Pressable
            accessibilityLabel="Add Asset or Service"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              router.push('/add');
            }}
            style={({ pressed }) => [styles.fab, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
          >
            <Icon name="add" size={26} color={colors.onSecondary} />
          </Pressable>
        </View>
        {rightRoutes.map(renderTab)}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  useNotificationSync();
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="assets" options={{ title: 'Assets' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
  },
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingVertical: 4 },
  fabSlot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
});
