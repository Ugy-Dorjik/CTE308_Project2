import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DAYS, SLOTS, cap } from './theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function askPermission() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('meals', { name: 'Meal reminders', importance: Notifications.AndroidImportance.DEFAULT });
    }
    const cur = await Notifications.getPermissionsAsync();
    if (cur.granted) return true;
    const req = await Notifications.requestPermissionsAsync();
    return !!req.granted;
  } catch (e) {
    return false;
  }
}

// Re-creates one weekly notification for every planned meal.
export async function syncReminders(meals, times, enabled) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!enabled) return 0;
  let n = 0;
  for (let i = 0; i < 7; i++) {
    for (const s of SLOTS) {
      const m = meals[DAYS[i]]?.[s];
      if (!m) continue;
      const [hour, minute] = (times[s] || '12:00').split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        content: { title: `${cap(s)} time`, body: `Planned: ${m.name}` },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: ((i + 1) % 7) + 1, hour, minute, channelId: 'meals' },
      });
      n++;
    }
  }
  return n;
}
