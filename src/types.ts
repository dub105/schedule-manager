export interface BelongingItem {
  id: string;
  name: string;
  checked: boolean;
  note?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  location?: string;
  note?: string;
  belongings: BelongingItem[];
  color: EventColor;
  reminderMinutes?: number; // minutes before event to notify
  templateId?: string;
  pinned?: boolean;
  pinLabel?: PinLabel;
  createdAt: string;
}

export type PinLabel = 'fun' | 'important' | 'challenge' | 'reminder';

export type EventColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';

export interface BelongingTemplate {
  id: string;
  name: string;
  items: string[];
  icon: string;
}

export type ViewMode = 'today' | 'week' | 'calendar' | 'all';

// Timetable
export type PeriodNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface Period {
  period: PeriodNumber;
  label: string;
  start: string;
  end: string;
}

export interface Course {
  id: string;
  name: string;
  teacher?: string;
  room?: string;
  color: EventColor;
}

export interface ClassSession {
  id: string;
  date: string; // YYYY-MM-DD
  period: PeriodNumber;
  courseId: string;
  note?: string;
}
