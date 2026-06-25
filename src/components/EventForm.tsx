import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import { useStore } from '../store';
import type { Event, BelongingItem, EventColor } from '../types';
import { generateId, getTodayString } from '../utils';

const COLOR_OPTIONS: { value: EventColor; label: string; cls: string }[] = [
  { value: 'blue',   label: '青',   cls: 'bg-blue-500' },
  { value: 'green',  label: '緑',   cls: 'bg-green-500' },
  { value: 'purple', label: '紫',   cls: 'bg-purple-500' },
  { value: 'orange', label: '橙',   cls: 'bg-orange-500' },
  { value: 'red',    label: '赤',   cls: 'bg-red-500' },
  { value: 'pink',   label: 'ピンク', cls: 'bg-pink-500' },
];

const REMINDER_OPTIONS = [
  { value: undefined, label: 'なし' },
  { value: 10,  label: '10分前' },
  { value: 30,  label: '30分前' },
  { value: 60,  label: '1時間前' },
  { value: 120, label: '2時間前' },
];

export default function EventForm() {
  const { templates, editingEventId, events, addEvent, updateEvent, closeEventForm } = useStore();

  const editing = editingEventId ? events.find((e) => e.id === editingEventId) : null;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [color, setColor] = useState<EventColor>('blue');
  const [reminderMinutes, setReminderMinutes] = useState<number | undefined>(undefined);
  const [belongings, setBelongings] = useState<BelongingItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDate(editing.date);
      setStartTime(editing.startTime ?? '');
      setEndTime(editing.endTime ?? '');
      setLocation(editing.location ?? '');
      setNote(editing.note ?? '');
      setColor(editing.color);
      setReminderMinutes(editing.reminderMinutes);
      setBelongings(editing.belongings);
    }
  }, [editing]);

  function applyTemplate(templateId: string) {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    const newItems: BelongingItem[] = tpl.items.map((name) => ({
      id: generateId(),
      name,
      checked: false,
    }));
    const existingNames = new Set(belongings.map((b) => b.name));
    const toAdd = newItems.filter((i) => !existingNames.has(i.name));
    setBelongings((prev) => [...prev, ...toAdd]);
    setSelectedTemplateId('');
  }

  function addBelonging() {
    const name = newItem.trim();
    if (!name) return;
    setBelongings((prev) => [...prev, { id: generateId(), name, checked: false }]);
    setNewItem('');
  }

  function removeBelonging(id: string) {
    setBelongings((prev) => prev.filter((b) => b.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const eventData: Event = {
      id: editing?.id ?? generateId(),
      title: title.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      location: location.trim() || undefined,
      note: note.trim() || undefined,
      color,
      reminderMinutes,
      belongings,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    };

    if (editing) {
      updateEvent(editing.id, eventData);
    } else {
      addEvent(eventData);
    }
    closeEventForm();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeEventForm}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {editing ? 'イベントを編集' : '新しいイベント'}
          </h2>
          <button onClick={closeEventForm} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">タイトル *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：会議、ジム、病院..."
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">カラー</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.cls} transition-transform ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">日付 *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">開始</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">終了</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">場所</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例：渋谷オフィス、新宿ジム..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Reminder */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">リマインダー</label>
            <div className="relative">
              <select
                value={reminderMinutes ?? ''}
                onChange={(e) =>
                  setReminderMinutes(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8"
              >
                {REMINDER_OPTIONS.map((o) => (
                  <option key={String(o.value)} value={o.value ?? ''}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">メモ</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="追加メモ..."
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Belongings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">持ち物</label>
              <div className="relative">
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    if (e.target.value) applyTemplate(e.target.value);
                  }}
                  className="text-xs border border-slate-300 rounded-lg pl-2 pr-6 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer text-slate-600"
                >
                  <option value="">テンプレートから追加</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 mb-2 max-h-40 overflow-y-auto">
              {belongings.map((b) => (
                <div key={b.id} className="flex items-center gap-2 group">
                  <span className="flex-1 text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg">{b.name}</span>
                  <button
                    type="button"
                    onClick={() => removeBelonging(b.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addBelonging(); }
                }}
                placeholder="持ち物を追加..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={addBelonging}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeEventForm}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm font-medium text-white transition-colors"
            >
              {editing ? '保存する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
