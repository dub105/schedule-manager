import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Event, BelongingTemplate, ViewMode, PinLabel } from './types';

const DEFAULT_TEMPLATES: BelongingTemplate[] = [
  {
    id: 'work',
    name: '仕事・会社',
    icon: '💼',
    items: ['財布', 'スマートフォン', '定期券/交通系ICカード', 'PCとACアダプタ', '名刺', 'ハンカチ'],
  },
  {
    id: 'gym',
    name: 'ジム・運動',
    icon: '🏋️',
    items: ['スポーツウェア', 'シューズ', 'タオル', '水筒', 'ロッカーの鍵', 'シャンプー・石鹸'],
  },
  {
    id: 'travel',
    name: '旅行・外泊',
    icon: '✈️',
    items: ['パスポート/身分証', '財布・クレジットカード', '着替え', '洗面用具', '充電器', '常備薬', 'スマートフォン'],
  },
  {
    id: 'hospital',
    name: '病院・医療',
    icon: '🏥',
    items: ['保険証', '診察券', 'お薬手帳', '財布', 'スマートフォン'],
  },
  {
    id: 'school',
    name: '学校・授業',
    icon: '📚',
    items: ['教科書・参考書', 'ノート', '筆記用具', '学生証', '財布', 'スマートフォン'],
  },
];

interface AppState {
  events: Event[];
  templates: BelongingTemplate[];
  viewMode: ViewMode;
  selectedEventId: string | null;
  isEventFormOpen: boolean;
  editingEventId: string | null;

  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  toggleBelonging: (eventId: string, itemId: string) => void;
  resetBelongings: (eventId: string) => void;
  pinEvent: (eventId: string, label: PinLabel) => void;
  unpinEvent: (eventId: string) => void;

  addTemplate: (template: BelongingTemplate) => void;
  updateTemplate: (id: string, updates: Partial<BelongingTemplate>) => void;
  deleteTemplate: (id: string) => void;

  setViewMode: (mode: ViewMode) => void;
  setSelectedEventId: (id: string | null) => void;
  openEventForm: (editId?: string) => void;
  closeEventForm: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      events: [],
      templates: DEFAULT_TEMPLATES,
      viewMode: 'today',
      selectedEventId: null,
      isEventFormOpen: false,
      editingEventId: null,

      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          selectedEventId: state.selectedEventId === id ? null : state.selectedEventId,
        })),

      toggleBelonging: (eventId, itemId) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  belongings: e.belongings.map((b) =>
                    b.id === itemId ? { ...b, checked: !b.checked } : b
                  ),
                }
              : e
          ),
        })),

      resetBelongings: (eventId) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  belongings: e.belongings.map((b) => ({ ...b, checked: false })),
                }
              : e
          ),
        })),

      pinEvent: (eventId, label) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId ? { ...e, pinned: true, pinLabel: label } : e
          ),
        })),

      unpinEvent: (eventId) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId ? { ...e, pinned: false, pinLabel: undefined } : e
          ),
        })),

      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),

      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedEventId: (id) => set({ selectedEventId: id }),
      openEventForm: (editId) =>
        set({ isEventFormOpen: true, editingEventId: editId ?? null }),
      closeEventForm: () =>
        set({ isEventFormOpen: false, editingEventId: null }),
    }),
    { name: 'schedule-manager-storage' }
  )
);
