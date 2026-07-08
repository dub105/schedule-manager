import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();

// ─── Permission ───────────────────────────────────────────────────────────────

export async function requestPermission(): Promise<boolean> {
  if (isNative) {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  }
  if (!('Notification' in window)) return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export async function getPermissionStatus(): Promise<'granted' | 'denied' | 'default'> {
  if (isNative) {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.checkPermissions();
    return display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'default';
  }
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

// ─── Daily morning notification (native only) ─────────────────────────────────

const MORNING_NOTIF_ID = 100;

export async function scheduleMorningNotification(): Promise<void> {
  if (!isNative) return;
  const { LocalNotifications } = await import('@capacitor/local-notifications');

  // Cancel any existing morning notification first
  await LocalNotifications.cancel({ notifications: [{ id: MORNING_NOTIF_ID }] });

  await LocalNotifications.schedule({
    notifications: [
      {
        id: MORNING_NOTIF_ID,
        title: '📅 おはようございます！',
        body: '今日の予定と持ち物を確認しましょう',
        schedule: {
          on: { hour: 5, minute: 30 },
          repeats: true,
          allowWhileIdle: true,
        },
      },
    ],
  });
}

export async function cancelMorningNotification(): Promise<void> {
  if (!isNative) return;
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  await LocalNotifications.cancel({ notifications: [{ id: MORNING_NOTIF_ID }] });
}

export async function isMorningNotificationScheduled(): Promise<boolean> {
  if (!isNative) return false;
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  const { notifications } = await LocalNotifications.getPending();
  return notifications.some((n) => n.id === MORNING_NOTIF_ID);
}

// ─── One-shot web notification (browser only) ─────────────────────────────────

export function showWebNotification(title: string, body: string): void {
  if (isNative || Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: '/schedule-manager/icon-192.png' });
}
