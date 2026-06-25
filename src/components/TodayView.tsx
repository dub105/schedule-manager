import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarDays, Package } from 'lucide-react';
import { useStore } from '../store';
import { getTodayEvents, sortEventsByDateTime } from '../utils';
import EventCard from './EventCard';

export default function TodayView() {
  const { events, openEventForm } = useStore();
  const todayEvents = sortEventsByDateTime(getTodayEvents(events));
  const today = format(new Date(), 'yyyy年M月d日(E)', { locale: ja });

  const totalBelongings = todayEvents.reduce((sum, e) => sum + e.belongings.length, 0);
  const checkedBelongings = todayEvents.reduce(
    (sum, e) => sum + e.belongings.filter((b) => b.checked).length,
    0
  );

  return (
    <div className="space-y-4">
      {/* Date header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={18} />
          <span className="text-sm font-medium opacity-90">今日</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">{today}</h2>
        <div className="flex gap-4 text-sm">
          <div className="bg-white/20 rounded-xl px-3 py-1.5">
            <span className="font-semibold">{todayEvents.length}</span>
            <span className="opacity-90 ml-1">件のイベント</span>
          </div>
          {totalBelongings > 0 && (
            <div className="bg-white/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <Package size={14} />
              <span className="font-semibold">{checkedBelongings}/{totalBelongings}</span>
              <span className="opacity-90">準備済み</span>
            </div>
          )}
        </div>
      </div>

      {/* Events */}
      {todayEvents.length > 0 ? (
        <div className="space-y-3">
          {todayEvents.map((event) => (
            <EventCard key={event.id} event={event} expanded={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-slate-500 font-medium mb-1">今日のイベントはありません</p>
          <p className="text-slate-400 text-sm mb-4">新しいイベントを追加してみましょう</p>
          <button
            onClick={() => openEventForm()}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            イベントを追加
          </button>
        </div>
      )}
    </div>
  );
}
