import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function AddFlowLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="review" />
      <Stack.Screen name="manual" />
    </Stack>
  );
}
