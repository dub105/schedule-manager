import { differenceInCalendarDays, parseISO } from 'date-fns';
import { X, MapPin, Clock, Star } from 'lucide-react';
import { useStore } from '../store';
import type { Event } from '../types';
import { sortEventsByDateTime } from '../utils';

function getCountdownInfo(event: Event): {
  days: number;
  label: string;
  emoji: string;
  sublabel: string;
} {
  const days = differenceInCalendarDays(parseISO(event.date), new Date());

  if (days < 0) return { days, label: '終了', emoji: '✅', sublabel: '楽しかったですね！' };
  if (days === 0) return { days, label: '今日！', emoji: '🎉', sublabel: 'ついにこの日がやってきました！' };
  if (days === 1) return { days, label: '明日！', emoji: '🌟', sublabel: 'あと少し、楽しみにしていてください！' };
  if (days <= 7)  return { days, label: `あと${days}日`, emoji: '✨', sublabel: 'もうすぐです、楽しみにしていてください！' };
  if (days <= 30) return { days, label: `あと${days}日`, emoji: '🗓️', sublabel: 'その日を楽しみに頑張りましょう！' };
  return { days, label: `あと${days}日`, emoji: '💫', sublabel: 'まだまだ先ですが、楽しみに！' };
}

const GRADIENT_BY_COLOR: Record<string, string> = {
  blue:   'from-blue-500 via-blue-600 to-indigo-600',
  green:  'from-green-500 via-emerald-500 to-teal-600',
  purple: 'from-purple-500 via-violet-500 to-indigo-500',
  orange: 'from-orange-400 via-amber-500 to-yellow-500',
  red:    'from-red-500 via-rose-500 to-pink-500',
  pink:   'from-pink-400 via-rose-500 to-fuchsia-500',
};

export default function PinnedEventBanner() {
  const { events, togglePin } = useStore();

  const pinnedEvents = sortEventsByDateTime(
    events.filter((e) => e.pinned)
  );

  if (pinnedEvents.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {pinnedEvents.map((event) => {
        const { label, emoji, sublabel } = getCountdownInfo(event);
        const gradient = GRADIENT_BY_COLOR[event.color] ?? GRADIENT_BY_COLOR.blue;

        return (
          <div
            key={event.id}
            className={`relative rounded-2xl bg-gradient-to-br ${gradient} text-white p-5 shadow-lg overflow-hidden`}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-end pr-4">
              <span className="text-[120px] leading-none">{emoji}</span>
            </div>

            {/* Unpin button */}
            <button
              onClick={() => togglePin(event.id)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title="ピン留めを外す"
            >
              <X size={14} />
            </button>

            {/* Pinned badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <Star size={13} className="fill-yellow-300 text-yellow-300" />
              <span className="text-xs font-semibold opacity-90 tracking-wide">楽しみな予定</span>
            </div>

            {/* Main content */}
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-xl font-bold leading-tight mb-1 truncate pr-8">{event.title}</h3>
                <div className="flex flex-wrap gap-2 text-sm opacity-90">
                  {event.startTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {event.startTime}{event.endTime ? `〜${event.endTime}` : ''}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={13} />
                      {event.location}
                    </span>
                  )}
                </div>
                <p className="text-xs opacity-75 mt-1.5">{sublabel}</p>
              </div>

              {/* Countdown */}
              <div className="flex-shrink-0 text-right">
                <div className="text-3xl font-black leading-none">{label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
