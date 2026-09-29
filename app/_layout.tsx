import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { queryClient, asyncStoragePersister } from '@/lib/queryClient';
import { setupOfflineSync } from '@/lib/offline';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/theme';
import { OfflineBanner } from '@/components';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const init = useAuthStore((s) => s.init);
  const initializing = useAuthStore((s) => s.initializing);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const unsubscribe = init();
    setupOfflineSync();
    setOfflineReady(true);
    return unsubscribe;
  }, [init]);

  useEffect(() => {
    if (fontsLoaded && !initializing && offlineReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, initializing, offlineReady]);

  if (!fontsLoaded || initializing || !offlineReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister, maxAge: 1000 * 60 * 60 * 24 }}
        >
          <StatusBar style="dark" />
          <OfflineBanner />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add" options={{ presentation: 'modal' }} />
            <Stack.Screen name="asset/[id]" />
            <Stack.Screen name="reminder/[id]" />
            <Stack.Screen name="documents" />
            <Stack.Screen name="search" options={{ presentation: 'modal' }} />
            <Stack.Screen name="settings" />
            <Stack.Screen name="subscription" options={{ presentation: 'modal' }} />
          </Stack>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
