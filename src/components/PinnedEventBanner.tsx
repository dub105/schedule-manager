import { differenceInCalendarDays, parseISO } from 'date-fns';
import { X, MapPin, Clock } from 'lucide-react';
import { useStore } from '../store';
import type { Event, PinLabel } from '../types';
import { sortEventsByDateTime } from '../utils';

interface PinConfig {
  emoji: string;
  badgeText: string;
  gradient: string;
  countdownText: (days: number) => string;
  sublabel: (days: number) => string;
}

const PIN_CONFIGS: Record<PinLabel, PinConfig> = {
  fun: {
    emoji: '⭐',
    badgeText: '楽しみな予定',
    gradient: 'from-orange-400 via-amber-400 to-yellow-400',
    countdownText: (d) => d === 0 ? '今日！' : d === 1 ? '明日！' : d < 0 ? '終了' : `あと${d}日`,
    sublabel: (d) => {
      if (d < 0)  return '楽しかったですね！';
      if (d === 0) return 'ついにこの日がやってきました！🎉';
      if (d === 1) return 'あと少し、楽しみにしていてください！🌟';
      if (d <= 7)  return 'もうすぐです、楽しみにしていてください！✨';
      if (d <= 30) return 'その日を楽しみに頑張りましょう！';
      return 'まだまだ先ですが、楽しみに！💫';
    },
  },
  important: {
    emoji: '📌',
    badgeText: '重要な予定',
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    countdownText: (d) => d === 0 ? '今日！' : d === 1 ? '明日' : d < 0 ? '終了' : `あと${d}日`,
    sublabel: (d) => {
      if (d < 0)  return 'お疲れさまでした。';
      if (d === 0) return '今日が重要な日です。準備はできていますか？';
      if (d === 1) return '明日に迫っています。忘れ物がないか確認しましょう。';
      if (d <= 7)  return '来週までに準備を整えておきましょう。';
      return '大切な予定です。早めに準備を進めましょう。';
    },
  },
  challenge: {
    emoji: '💪',
    badgeText: '頑張る予定',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    countdownText: (d) => d === 0 ? '今日！' : d === 1 ? '明日' : d < 0 ? '終了' : `あと${d}日`,
    sublabel: (d) => {
      if (d < 0)  return 'よく頑張りました！お疲れさまでした。';
      if (d === 0) return 'いよいよ本番です。全力で挑みましょう！💪';
      if (d === 1) return '明日が本番！最後の準備を万全に。';
      if (d <= 7)  return 'もうすぐです。ラストスパート頑張りましょう！';
      return 'その日に向けて、一歩一歩積み上げていきましょう！';
    },
  },
  reminder: {
    emoji: '🔔',
    badgeText: '要確認',
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
    countdownText: (d) => d === 0 ? '今日！' : d === 1 ? '明日' : d < 0 ? '期限切れ' : `あと${d}日`,
    sublabel: (d) => {
      if (d < 0)  return '確認期限が過ぎています。';
      if (d === 0) return '今日中に確認が必要です！';
      if (d === 1) return '明日までに確認しておきましょう。';
      if (d <= 3)  return '近いうちに確認が必要です。忘れずに！';
      return '期限までに余裕を持って確認しておきましょう。';
    },
  },
};

function getCountdown(event: Event) {
  const days = differenceInCalendarDays(parseISO(event.date), new Date());
  const config = PIN_CONFIGS[event.pinLabel ?? 'fun'];
  return {
    days,
    countdownText: config.countdownText(days),
    sublabel: config.sublabel(days),
  };
}

export default function PinnedEventBanner() {
  const { events, unpinEvent } = useStore();

  const pinnedEvents = sortEventsByDateTime(events.filter((e) => e.pinned));

  if (pinnedEvents.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {pinnedEvents.map((event) => {
        const config = PIN_CONFIGS[event.pinLabel ?? 'fun'];
        const { countdownText, sublabel } = getCountdown(event);

        return (
          <div
            key={event.id}
            className={`relative rounded-2xl bg-gradient-to-br ${config.gradient} text-white p-5 shadow-lg overflow-hidden`}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-end pr-4">
              <span className="text-[120px] leading-none">{config.emoji}</span>
            </div>

            {/* Unpin button */}
            <button
              onClick={() => unpinEvent(event.id)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title="ピン留めを外す"
            >
              <X size={14} />
            </button>

            {/* Badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">{config.emoji}</span>
              <span className="text-xs font-semibold opacity-90 tracking-wide">{config.badgeText}</span>
            </div>

            {/* Main content */}
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-xl font-bold leading-tight mb-1 truncate pr-8">{event.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm opacity-90">
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
                <div className="text-3xl font-black leading-none">{countdownText}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
