import { MapPin, Clock, Edit2, Trash2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Event } from '../types';
import { useStore } from '../store';
import { formatDate, getEventColorClasses } from '../utils';

interface Props {
  event: Event;
  expanded?: boolean;
}

export default function EventCard({ event, expanded: defaultExpanded = false }: Props) {
  const { toggleBelonging, resetBelongings, deleteEvent, openEventForm } = useStore();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const colors = getEventColorClasses(event.color);
  const checkedCount = event.belongings.filter((b) => b.checked).length;
  const totalCount = event.belongings.length;
  const allChecked = totalCount > 0 && checkedCount === totalCount;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  function handleDelete() {
    if (showDeleteConfirm) {
      deleteEvent(event.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
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
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-slate-400">持ち物 {checkedCount}/{totalCount}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${allChecked ? 'bg-green-400' : colors.bg}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
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
                  title="チェックをリセット"
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
