import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Device.isDevice) return false; // simulators/emulators can't receive push, local notifications still work on most
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const result = await Notifications.requestPermissionsAsync();
    status = result.status;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return status === 'granted';
}

export interface LocalReminderInput {
  identifier: string;
  title: string;
  body: string;
  fireDate: Date;
  data?: Record<string, unknown>;
}

export async function scheduleLocalReminder({ identifier, title, body, fireDate, data }: LocalReminderInput) {
  await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
  if (fireDate.getTime() <= Date.now()) return; // don't schedule reminders in the past
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body, data },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate },
  });
}

export async function cancelLocalReminder(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
}
