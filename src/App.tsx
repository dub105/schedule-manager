import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import TodayView from './components/TodayView';
import WeekView from './components/WeekView';
import CalendarView from './components/CalendarView';
import AllEventsView from './components/AllEventsView';
import TemplateManager from './components/TemplateManager';
import EventForm from './components/EventForm';
import './index.css';

type ViewMode = 'today' | 'week' | 'calendar' | 'all' | 'templates';

const VIEW_TITLES: Record<ViewMode, string> = {
  today: '今日のスケジュール',
  week: '週間スケジュール',
  calendar: 'カレンダー',
  all: 'すべてのイベント',
  templates: '持ち物テンプレート',
};

export default function App() {
  const { isEventFormOpen, openEventForm } = useStore();
  const [currentView, setCurrentView] = useState<ViewMode>('today');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={(v) => setCurrentView(v as ViewMode)} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h1 className="text-base font-semibold text-slate-800">{VIEW_TITLES[currentView]}</h1>
          {currentView !== 'templates' && (
            <button
              onClick={() => openEventForm()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <Plus size={16} />
              イベントを追加
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {currentView === 'today' && <TodayView />}
            {currentView === 'week' && <WeekView />}
            {currentView === 'calendar' && <CalendarView />}
            {currentView === 'all' && <AllEventsView />}
            {currentView === 'templates' && <TemplateManager />}
          </div>
        </div>
      </main>

      {isEventFormOpen && <EventForm />}
    </div>
  );
}
