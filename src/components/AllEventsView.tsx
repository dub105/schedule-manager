import { parseISO, isBefore, startOfDay } from 'date-fns';
import { useStore } from '../store';
import { sortEventsByDateTime } from '../utils';
import EventCard from './EventCard';

export default function AllEventsView() {
  const { events, openEventForm } = useStore();
  const sorted = sortEventsByDateTime(events);
  const today = startOfDay(new Date());

  const upcoming = sorted.filter((e) => !isBefore(parseISO(e.date), today));
  const past = sorted.filter((e) => isBefore(parseISO(e.date), today)).reverse();

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-3">📋</div>
        <p className="text-slate-500 font-medium mb-1">イベントがありません</p>
        <p className="text-slate-400 text-sm mb-4">スケジュールと持ち物を追加してみましょう</p>
        <button
          onClick={() => openEventForm()}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          イベントを追加
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            これからの予定 ({upcoming.length})
          </h2>
          <div className="space-y-2">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            過去の予定 ({past.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
