import { format, startOfWeek, addDays, isToday, parseISO, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useStore } from '../store';
import { sortEventsByDateTime } from '../utils';
import EventCard from './EventCard';

export default function WeekView() {
  const { events, openEventForm } = useStore();
  const sorted = sortEventsByDateTime(events);

  const weekStart = startOfWeek(new Date(), { locale: ja });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700 px-1">今週のスケジュール</h2>
      {days.map((day) => {
        const dayEvents = sorted.filter((e) => isSameDay(parseISO(e.date), day));
        const isCurrentDay = isToday(day);

        return (
          <div key={day.toISOString()}>
            <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${isCurrentDay ? 'border-blue-200' : 'border-slate-100'}`}>
              <span
                className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                  isCurrentDay ? 'bg-blue-500 text-white' : 'text-slate-500'
                }`}
              >
                {format(day, 'M/d', { locale: ja })}
              </span>
              <span className={`text-xs ${isCurrentDay ? 'text-blue-500 font-medium' : 'text-slate-400'}`}>
                {format(day, 'E', { locale: ja })}曜日
                {isCurrentDay && ' (今日)'}
              </span>
            </div>

            {dayEvents.length > 0 ? (
              <div className="space-y-2 pl-2">
                {dayEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <button
                onClick={() => openEventForm()}
                className="w-full text-xs text-slate-300 hover:text-slate-400 text-left pl-2 py-1 transition-colors"
              >
                + イベントを追加
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
