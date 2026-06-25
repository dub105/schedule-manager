import { CalendarDays, Calendar, List, LayoutGrid, Package, Bell, BellOff } from 'lucide-react';
import { useStore } from '../store';
import type { ViewMode } from '../types';
import { requestNotificationPermission } from '../utils';
import { useState, useEffect } from 'react';

interface NavItem {
  mode: ViewMode | 'templates';
  icon: React.ReactNode;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { mode: 'today',    icon: <CalendarDays size={18} />, label: '今日' },
  { mode: 'week',     icon: <LayoutGrid size={18} />,  label: '今週' },
  { mode: 'calendar', icon: <Calendar size={18} />,    label: 'カレンダー' },
  { mode: 'all',      icon: <List size={18} />,        label: 'すべて' },
  { mode: 'templates', icon: <Package size={18} />,   label: 'テンプレート' },
];

interface Props {
  currentView: string;
  onViewChange: (v: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: Props) {
  const { events } = useStore();
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) setNotifPerm(Notification.permission);
  }, []);

  async function handleNotifToggle() {
    const perm = await requestNotificationPermission();
    setNotifPerm(perm);
  }

  const todayCount = events.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <CalendarDays size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">スケジュール</h1>
            <p className="text-xs text-slate-400">持ち物マネージャー</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.mode}
            onClick={() => onViewChange(item.mode)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentView === item.mode
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.mode === 'today' && todayCount > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {todayCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Notification toggle */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleNotifToggle}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors ${
            notifPerm === 'granted'
              ? 'text-green-600 bg-green-50'
              : 'text-slate-400 hover:bg-slate-50'
          }`}
          title={notifPerm === 'granted' ? 'リマインダー通知ON' : '通知を有効にする'}
        >
          {notifPerm === 'granted' ? <Bell size={15} /> : <BellOff size={15} />}
          <span>{notifPerm === 'granted' ? '通知ON' : '通知を有効にする'}</span>
        </button>
      </div>
    </aside>
  );
}
