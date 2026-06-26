import { MapPin, Clock, Edit2, Trash2, RotateCcw, ChevronDown, ChevronUp, Star, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Event, PinLabel } from '../types';
import { useStore } from '../store';
import { formatDate, getEventColorClasses } from '../utils';

const PIN_OPTIONS: { label: PinLabel; emoji: string; text: string; color: string }[] = [
  { label: 'fun',       emoji: '⭐', text: '楽しみな予定', color: 'hover:bg-yellow-50 hover:text-yellow-700' },
  { label: 'important', emoji: '📌', text: '重要な予定',   color: 'hover:bg-red-50 hover:text-red-700' },
  { label: 'challenge', emoji: '💪', text: '頑張る予定',   color: 'hover:bg-blue-50 hover:text-blue-700' },
  { label: 'reminder',  emoji: '🔔', text: '要確認',       color: 'hover:bg-purple-50 hover:text-purple-700' },
];

interface Props {
  event: Event;
  expanded?: boolean;
}

export default function EventCard({ event, expanded: defaultExpanded = false }: Props) {
  const { toggleBelonging, resetBelongings, deleteEvent, openEventForm, pinEvent, unpinEvent } = useStore();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPinMenu, setShowPinMenu] = useState(false);
  const pinMenuRef = useRef<HTMLDivElement>(null);

  const colors = getEventColorClasses(event.color);
  const checkedCount = event.belongings.filter((b) => b.checked).length;
  const totalCount = event.belongings.length;
  const allChecked = totalCount > 0 && checkedCount === totalCount;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const currentPin = PIN_OPTIONS.find((o) => o.label === event.pinLabel);

  useEffect(() => {
    if (!showPinMenu) return;
    function handler(e: MouseEvent) {
      if (pinMenuRef.current && !pinMenuRef.current.contains(e.target as Node)) {
        setShowPinMenu(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPinMenu]);

  function handleDelete() {
    if (showDeleteConfirm) {
      deleteEvent(event.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  }

  function handlePinClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (event.pinned) {
      unpinEvent(event.id);
    } else {
      setShowPinMenu(true);
    }
  }

  function handleSelectLabel(e: React.MouseEvent, label: PinLabel) {
    e.stopPropagation();
    pinEvent(event.id, label);
    setShowPinMenu(false);
  }

  return (
    <div className={`bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${colors.border}`}>
      {/* Header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-3 h-3 mt-1 rounded-full flex-shrink-0 ${colors.bg}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-800 text-sm truncate">{event.title}</h3>
            {event.pinned && currentPin && (
              <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium border border-yellow-200">
                {currentPin.emoji} {currentPin.text}
              </span>
            )}
            {allChecked && totalCount > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                ✓ 準備完了
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs text-slate-500">{formatDate(event.date)}</span>
            {event.startTime && (
              <span className="flex items-center gap-0.5 text-xs text-slate-500">
                <Clock size={11} />
                {event.startTime}{event.endTime ? `〜${event.endTime}` : ''}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-0.5 text-xs text-slate-500 truncate max-w-[140px]">
                <MapPin size={11} />
                {event.location}
              </span>
            )}
          </div>
          {totalCount > 0 && (
            <div className="mt-2">
              <span className="text-xs text-slate-400">持ち物 {checkedCount}/{totalCount}</span>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${allChecked ? 'bg-green-400' : colors.bg}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Pin button with popover */}
          <div className="relative" ref={pinMenuRef}>
            <button
              onClick={handlePinClick}
              className={`p-1.5 rounded-lg transition-colors ${
                event.pinned
                  ? 'text-yellow-400 hover:text-slate-400'
                  : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-100'
              }`}
              title={event.pinned ? 'ピン留めを外す' : 'ダッシュボードに固定'}
            >
              <Star size={14} className={event.pinned ? 'fill-yellow-400' : ''} />
            </button>

            {showPinMenu && (
              <div
                className="absolute right-0 top-8 z-30 bg-white rounded-xl shadow-xl border border-slate-100 w-40 py-1 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">固定する理由</span>
                  <button onClick={(e) => { e.stopPropagation(); setShowPinMenu(false); }} className="text-slate-300 hover:text-slate-500">
                    <X size={12} />
                  </button>
                </div>
                {PIN_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={(e) => handleSelectLabel(e, opt.label)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 transition-colors ${opt.color}`}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); openEventForm(event.id); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className={`p-1.5 rounded-lg transition-colors ${
              showDeleteConfirm
                ? 'bg-red-100 text-red-600'
                : 'hover:bg-slate-100 text-slate-400 hover:text-red-500'
            }`}
            title={showDeleteConfirm ? 'もう一度押して削除' : '削除'}
          >
            <Trash2 size={14} />
          </button>
          {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className={`border-t border-slate-100 p-4 ${colors.light} rounded-b-xl`}>
          {event.note && (
            <p className="text-xs text-slate-600 mb-3 bg-white/70 rounded-lg px-3 py-2">{event.note}</p>
          )}

          {totalCount > 0 ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">持ち物チェックリスト</span>
                <button
                  onClick={() => resetBelongings(event.id)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <RotateCcw size={11} />
                  リセット
                </button>
              </div>
              <div className="space-y-1.5">
                {event.belongings.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={() => toggleBelonging(event.id, item.id)}
                  >
                    <div
                      className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                        item.checked
                          ? `${colors.bg} border-transparent`
                          : 'border-slate-300 group-hover:border-slate-400'
                      }`}
                    >
                      {item.checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition-all ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">持ち物が登録されていません</p>
          )}
        </div>
      )}
    </div>
  );
}
