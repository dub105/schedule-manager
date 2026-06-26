import { useState, useRef, useEffect } from 'react';
import {
  format, startOfWeek, addDays, isToday,
  addWeeks, subWeeks,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react';
import { useStore } from '../store';
import type { PeriodNumber, Course } from '../types';
import { PERIODS, COURSE_COLORS } from '../timetableConstants';
import { generateId } from '../utils';

function getCourseColor(color: string) {
  return COURSE_COLORS.find((c) => c.value === color) ?? COURSE_COLORS[0];
}

export default function TimetableView() {
  const { courses, classSessions, setClassSession, addCourse } = useStore();
  const [weekBase, setWeekBase] = useState(new Date());
  const [showCourseManager, setShowCourseManager] = useState(courses.length === 0);

  const weekStart = startOfWeek(weekBase, { locale: ja });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function getSession(date: string, period: PeriodNumber) {
    return classSessions.find((s) => s.date === date && s.period === period) ?? null;
  }

  function getCourse(courseId: string) {
    return courses.find((c) => c.id === courseId) ?? null;
  }

  if (courses.length === 0 && showCourseManager) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
          まず科目を登録してから、時間割に割り当てましょう。
        </div>
        <CourseManager onClose={() => setShowCourseManager(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekBase(subWeeks(weekBase, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <h2 className="text-base font-semibold text-slate-800 min-w-[160px] text-center">
            {format(days[0], 'M月d日', { locale: ja })} 〜 {format(days[6], 'M月d日', { locale: ja })}
          </h2>
          <button
            onClick={() => setWeekBase(addWeeks(weekBase, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={18} className="text-slate-600" />
          </button>
          <button
            onClick={() => setWeekBase(new Date())}
            className="text-xs text-blue-500 hover:text-blue-600 font-medium px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors"
          >
            今週
          </button>
        </div>
        <button
          onClick={() => setShowCourseManager(!showCourseManager)}
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <BookOpen size={15} />
          科目管理
        </button>
      </div>

      {showCourseManager && (
        <CourseManager onClose={() => setShowCourseManager(false)} />
      )}

      {/* Timetable grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Day header row */}
        <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
          <div className="py-2.5 border-r border-slate-100" />
          {days.map((day, i) => {
            const today = isToday(day);
            const dayName = ['日', '月', '火', '水', '木', '金', '土'][i];
            return (
              <div key={i} className={`py-2.5 text-center border-r border-slate-100 last:border-0 ${today ? 'bg-blue-50' : ''}`}>
                <div className={`text-xs font-semibold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-500'}`}>
                  {dayName}
                </div>
                <div className={`text-sm font-bold mt-0.5 ${today ? 'text-blue-600' : 'text-slate-700'}`}>
                  {format(day, 'd')}
                </div>
                {today && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-0.5" />}
              </div>
            );
          })}
        </div>

        {/* Period rows */}
        {PERIODS.map((period) => (
          <div key={period.period}>
            {/* Lunch break before 4th period */}
            {period.period === 4 && (
              <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
                <div className="py-1.5 px-1 border-r border-slate-100 flex flex-col items-center justify-center">
                  <span className="text-[9px] text-slate-400 leading-tight text-center">昼休み</span>
                  <span className="text-[9px] text-slate-300 leading-tight">11:50</span>
                  <span className="text-[9px] text-slate-300 leading-tight">12:50</span>
                </div>
                {days.map((_, i) => (
                  <div
                    key={i}
                    className="bg-amber-50 border-r border-slate-100 last:border-0 py-1.5 flex items-center justify-center"
                  >
                    <span className="text-[10px] text-amber-400 font-medium">🍱 昼休み</span>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`grid border-b border-slate-100 last:border-0`}
              style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}
            >
              {/* Period label */}
              <div className="py-3 px-1 border-r border-slate-100 flex flex-col items-center justify-center gap-0.5 bg-slate-50">
                <span className="text-xs font-bold text-slate-600">{period.label}</span>
                <span className="text-[10px] text-slate-400">{period.start}</span>
                <span className="text-[10px] text-slate-300">↓</span>
                <span className="text-[10px] text-slate-400">{period.end}</span>
              </div>

              {/* Day cells */}
              {days.map((day, di) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const session = getSession(dateStr, period.period as PeriodNumber);
                const course = session ? getCourse(session.courseId) : null;
                const today = isToday(day);

                return (
                  <TimetableCell
                    key={di}
                    date={dateStr}
                    period={period.period as PeriodNumber}
                    course={course}
                    isToday={today}
                    courses={courses}
                    onSelect={(courseId) => setClassSession(dateStr, period.period as PeriodNumber, courseId)}
                    onQuickAdd={(name) => {
                      const colors = COURSE_COLORS;
                      const usedColors = new Set(courses.map((c) => c.color));
                      const nextColor = colors.find((c) => !usedColors.has(c.value))?.value ?? 'blue';
                      const newCourse: Course = { id: generateId(), name, color: nextColor as Course['color'] };
                      addCourse(newCourse);
                      setClassSession(dateStr, period.period as PeriodNumber, newCourse.id);
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cell ───────────────────────────────────────────────────────────────────

interface CellProps {
  date: string;
  period: PeriodNumber;
  course: Course | null;
  isToday: boolean;
  courses: Course[];
  onSelect: (courseId: string | null) => void;
  onQuickAdd: (name: string) => void;
}

function TimetableCell({ course, isToday, courses, onSelect, onQuickAdd }: CellProps) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [quickInput, setQuickInput] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function handleOpen() {
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 280);
    }
    setOpen(true);
  }

  const cc = course ? getCourseColor(course.color) : null;

  return (
    <div
      ref={cellRef}
      className={`relative border-r border-slate-100 last:border-0 min-h-[68px] cursor-pointer transition-colors
        ${isToday ? 'bg-blue-50/40' : 'hover:bg-slate-50'}
        ${open ? 'bg-slate-50' : ''}
      `}
      onClick={handleOpen}
    >
      {/* Course chip */}
      <div className="p-1.5 h-full flex flex-col">
        {course && cc ? (
          <div className={`flex-1 rounded-lg ${cc.light} ${cc.border} border px-2 py-1.5 flex flex-col gap-0.5`}>
            <span className={`text-xs font-semibold ${cc.text} leading-tight line-clamp-2`}>{course.name}</span>
            {course.room && (
              <span className="text-[10px] text-slate-400 truncate">{course.room}</span>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-slate-200 text-lg">+</span>
          </div>
        )}
      </div>

      {/* Popover */}
      {open && (
        <div
          ref={ref}
          className="absolute z-40 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-100 w-44 py-1 overflow-hidden"
          style={openUpward ? { bottom: '100%', marginBottom: 4 } : { top: '100%', marginTop: 4 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">科目を選択</span>
            <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-slate-500">
              <X size={12} />
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {course && (
              <button
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => { onSelect(null); setOpen(false); }}
              >
                ✕ 授業を削除
              </button>
            )}
            {courses.map((c) => {
              const col = getCourseColor(c.color);
              return (
                <button
                  key={c.id}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-50 ${c.id === course?.id ? 'bg-slate-50' : ''}`}
                  onClick={() => { onSelect(c.id); setOpen(false); }}
                >
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${col.cls}`} />
                  <span className="text-slate-700 text-xs truncate">{c.name}</span>
                  {c.id === course?.id && <span className="ml-auto text-blue-400 text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Quick add */}
          <div className="border-t border-slate-100 p-2">
            <div className="flex gap-1">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && quickInput.trim()) {
                    onQuickAdd(quickInput.trim());
                    setQuickInput('');
                    setOpen(false);
                  }
                }}
                placeholder="科目名を入力..."
                className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-0"
              />
              <button
                onClick={() => {
                  if (quickInput.trim()) {
                    onQuickAdd(quickInput.trim());
                    setQuickInput('');
                    setOpen(false);
                  }
                }}
                className="px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs transition-colors"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Course Manager ──────────────────────────────────────────────────────────

function CourseManager({ onClose }: { onClose: () => void }) {
  const { courses, addCourse, updateCourse, deleteCourse } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<Course['color']>('blue');
  const [newTeacher, setNewTeacher] = useState('');
  const [newRoom, setNewRoom] = useState('');

  function handleAdd() {
    if (!newName.trim()) return;
    addCourse({ id: generateId(), name: newName.trim(), teacher: newTeacher.trim() || undefined, room: newRoom.trim() || undefined, color: newColor });
    setNewName(''); setNewTeacher(''); setNewRoom(''); setNewColor('blue');
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">科目管理</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Add form */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="科目名 *"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              placeholder="教室"
              className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newTeacher}
              onChange={(e) => setNewTeacher(e.target.value)}
              placeholder="担当教員"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-1.5">
              {COURSE_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setNewColor(c.value as Course['color'])}
                  className={`w-6 h-6 rounded-full ${c.cls} transition-transform ${newColor === c.value ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                />
              ))}
            </div>
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              追加
            </button>
          </div>
        </div>

        {/* Course list */}
        {courses.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {courses.map((c) => {
              const col = getCourseColor(c.color);
              return editingId === c.id ? (
                <CourseEditRow
                  key={c.id}
                  course={c}
                  onSave={(updates) => { updateCourse(c.id, updates); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div key={c.id} className="flex items-center gap-2.5 group">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${col.cls}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-700">{c.name}</span>
                    {(c.teacher || c.room) && (
                      <span className="text-xs text-slate-400 ml-2">{[c.teacher, c.room].filter(Boolean).join(' / ')}</span>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(c.id)}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5 hover:bg-slate-100 rounded transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => deleteCourse(c.id)}
                      className="text-xs text-slate-400 hover:text-red-500 px-2 py-0.5 hover:bg-red-50 rounded transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseEditRow({
  course,
  onSave,
  onCancel,
}: {
  course: Course;
  onSave: (updates: Partial<Course>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(course.name);
  const [teacher, setTeacher] = useState(course.teacher ?? '');
  const [room, setRoom] = useState(course.room ?? '');
  const [color, setColor] = useState<Course['color']>(course.color);

  return (
    <div className="space-y-1.5 bg-slate-50 rounded-xl p-2.5">
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="教室" className="w-20 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div className="flex items-center gap-2">
        <input value={teacher} onChange={(e) => setTeacher(e.target.value)} placeholder="担当教員" className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <div className="flex gap-1">
          {COURSE_COLORS.map((c) => (
            <button key={c.value} onClick={() => setColor(c.value as Course['color'])} className={`w-5 h-5 rounded-full ${c.cls} ${color === c.value ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`} />
          ))}
        </div>
        <button onClick={() => onSave({ name, teacher: teacher || undefined, room: room || undefined, color })} className="text-xs bg-blue-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">保存</button>
        <button onClick={onCancel} className="text-xs text-slate-500 px-2 py-1.5 hover:bg-slate-200 rounded-lg transition-colors">×</button>
      </div>
    </div>
  );
}
