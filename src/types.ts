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
  createdAt: string;
}

export type EventColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';

export interface BelongingTemplate {
  id: string;
  name: string;
  items: string[];
  icon: string;
}

export type ViewMode = 'today' | 'week' | 'calendar' | 'all';
