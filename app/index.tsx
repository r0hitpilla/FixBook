import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/theme';

const ONBOARDED_KEY = 'fixbook_has_onboarded';

export default function Index() {
  const session = useAuthStore((s) => s.session);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((value) => setHasOnboarded(value === 'true'));
  }, []);

  if (hasOnboarded === null) {
    return <View style={{ flex: 1, backgroundColor: colors.surface }} />;
  }

  if (!hasOnboarded) return <Redirect href="/onboarding" />;
  if (!session) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)" />;
}

export { ONBOARDED_KEY };
