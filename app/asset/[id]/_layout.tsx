import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function AssetLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="timeline" />
      <Stack.Screen name="add-maintenance" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
