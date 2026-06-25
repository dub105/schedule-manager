import { format, isToday, isTomorrow, isThisWeek, parseISO, addMinutes } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Event, EventColor } from './types';

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return '今日';
  if (isTomorrow(date)) return '明日';
  return format(date, 'M月d日(E)', { locale: ja });
}

export function formatFullDate(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy年M月d日(E)', { locale: ja });
}

export function formatTime(time?: string): string {
  if (!time) return '';
  return time;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getWeekEvents(events: Event[]): Event[] {
  return events.filter((e) => {
    const d = parseISO(e.date);
    return isThisWeek(d, { locale: ja });
  });
}

export function getTodayEvents(events: Event[]): Event[] {
  return events.filter((e) => isToday(parseISO(e.date)));
}

export function sortEventsByDateTime(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return (a.startTime ?? '').localeCompare(b.startTime ?? '');
  });
}

export function getEventColorClasses(color: EventColor): {
  bg: string;
  text: string;
  border: string;
  light: string;
} {
  const map: Record<EventColor, { bg: string; text: string; border: string; light: string }> = {
    blue:   { bg: 'bg-blue-500',   text: 'text-blue-700',   border: 'border-blue-300',   light: 'bg-blue-50' },
    green:  { bg: 'bg-green-500',  text: 'text-green-700',  border: 'border-green-300',  light: 'bg-green-50' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-300', light: 'bg-purple-50' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-300', light: 'bg-orange-50' },
    red:    { bg: 'bg-red-500',    text: 'text-red-700',    border: 'border-red-300',    light: 'bg-red-50' },
    pink:   { bg: 'bg-pink-500',   text: 'text-pink-700',   border: 'border-pink-300',   light: 'bg-pink-50' },
  };
  return map[color];
}

export function scheduleReminder(event: Event): void {
  if (!event.startTime || !event.reminderMinutes) return;
  if (Notification.permission !== 'granted') return;

  const [h, m] = event.startTime.split(':').map(Number);
  const eventDate = parseISO(event.date);
  eventDate.setHours(h, m, 0, 0);

  const notifyAt = addMinutes(eventDate, -event.reminderMinutes);
  const now = new Date();
  const delay = notifyAt.getTime() - now.getTime();

  if (delay <= 0) return;

  setTimeout(() => {
    new Notification(`📅 ${event.title}`, {
      body: `${event.reminderMinutes}分後に開始します${event.location ? `\n📍 ${event.location}` : ''}`,
      icon: '/favicon.ico',
    });
  }, delay);
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return Promise.resolve('denied');
  return Notification.requestPermission();
}
