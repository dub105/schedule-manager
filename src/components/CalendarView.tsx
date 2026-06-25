import { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, isSameMonth, isSameDay, isToday, parseISO, addMonths, subMonths,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { getEventColorClasses } from '../utils';
import EventCard from './EventCard';

export default function CalendarView() {
  const { events, openEventForm } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { locale: ja });
  const calEnd = endOfWeek(monthEnd, { locale: ja });

  const weeks: Date[][] = [];
  let day = calStart;
  while (day <= calEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const selectedEvents = selectedDate
    ? events.filter((e) => isSameDay(parseISO(e.date), selectedDate))
    : [];

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={18} className="text-slate-600" />
        </button>
        <h2 className="text-lg font-semibold text-slate-800">
          {format(currentMonth, 'yyyy年M月', { locale: ja })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronRight size={18} className="text-slate-600" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {dayNames.map((d, i) => (
            <div
              key={d}
              className={`py-2 text-center text-xs font-semibold ${
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-500'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-slate-50 last:border-0">
            {week.map((d, di) => {
              const dayEvents = events.filter((e) => isSameDay(parseISO(e.date), d));
              const inMonth = isSameMonth(d, currentMonth);
              const isSelected = selectedDate && isSameDay(d, selectedDate);
              const isCurrentDay = isToday(d);

              return (
                <div
                  key={di}
                  onClick={() => setSelectedDate(isSameDay(d, selectedDate ?? new Date(-1)) ? null : d)}
                  className={`min-h-[60px] p-1.5 cursor-pointer transition-colors border-r border-slate-50 last:border-0 ${
                    !inMonth ? 'bg-slate-25 opacity-40' : 'hover:bg-slate-50'
                  } ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold mb-1 ${
                      isCurrentDay
                        ? 'bg-blue-500 text-white'
                        : isSelected
                        ? 'bg-blue-100 text-blue-700'
                        : di === 0
                        ? 'text-red-400'
                        : di === 6
                        ? 'text-blue-400'
                        : 'text-slate-700'
                    }`}
                  >
                    {format(d, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((e) => {
                      const c = getEventColorClasses(e.color);
                      return (
                        <div
                          key={e.id}
                          className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${c.light} ${c.text} font-medium`}
                        >
                          {e.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-slate-400 px-1">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected day events */}
      {selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">
              {format(selectedDate, 'M月d日(E)', { locale: ja })} のイベント
            </h3>
            <button
              onClick={() => openEventForm()}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              + 追加
            </button>
          </div>
          {selectedEvents.length > 0 ? (
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <EventCard key={event.id} event={event} expanded />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">この日のイベントはありません</p>
          )}
        </div>
      )}
    </div>
  );
}
