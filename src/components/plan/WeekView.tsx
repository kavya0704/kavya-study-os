import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { StudyDay, StudyTask } from '../../types';
import { getDb } from '../../services/db';

interface WeekViewProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenTaskDetails?: (task: StudyTask) => void;
}

interface DayWeekSummary {
  date: string;
  dayNumber: number;
  dayName: string;
  dayType: string;
  isRestDay: boolean;
  tasks: StudyTask[];
  completedCount: number;
  totalCount: number;
  focusedMinutes: number;
}

export const WeekView: React.FC<WeekViewProps> = ({
  selectedDate,
  onSelectDate,
  onOpenTaskDetails
}) => {
  const [weekDays, setWeekDays] = useState<DayWeekSummary[]>([]);
  const [currentWeekNumber, setCurrentWeekNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  // Determine Monday of the week containing selectedDate
  const getMondayOfDate = (dateStr: string) => {
    const d = new Date(`${dateStr}T00:00:00`);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const monday = getMondayOfDate(selectedDate);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);

  useEffect(() => {
    async function loadWeekData() {
      setLoading(true);
      try {
        const db = await getDb();
        const daysList: DayWeekSummary[] = [];
        const cur = new Date(monday);
        let foundWeekNumber = 1;

        for (let i = 0; i < 7; i++) {
          const dStr = cur.toISOString().split('T')[0];
          let dayRecord: StudyDay | undefined;
          let allTasks: StudyTask[] = [];

          try {
            dayRecord = await db.get('study_days', `day-${dStr}`);
          } catch {
            // Safe fallback
          }

          try {
            allTasks = await db.getAllFromIndex('study_tasks', 'by_currentDate', dStr);
          } catch {
            const all = await db.getAll('study_tasks') as StudyTask[];
            allTasks = all.filter(t => t.currentDate === dStr);
          }

          const isRest = Boolean(
            dayRecord?.isProtectedRestDay ||
            (dStr >= '2026-10-17' && dStr <= '2026-10-21')
          );

          const completed = allTasks.filter(t => t.status === 'completed').length;
          const focused = allTasks.reduce((acc, t) => acc + (t.status === 'completed' ? t.plannedMinutes : 0), 0);

          if (dayRecord && dayRecord.weekNumber) {
            foundWeekNumber = dayRecord.weekNumber;
          }

          daysList.push({
            date: dStr,
            dayNumber: dayRecord?.dayNumber || 0,
            dayName: cur.toLocaleDateString('en-US', { weekday: 'short' }),
            dayType: dayRecord?.dayType || 'non_college',
            isRestDay: isRest,
            tasks: allTasks,
            completedCount: completed,
            totalCount: allTasks.length,
            focusedMinutes: focused
          });

          cur.setDate(cur.getDate() + 1);
        }

        setWeekDays(daysList);
        setCurrentWeekNumber(foundWeekNumber);
      } catch (err) {
        console.error('Failed to load week data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWeekData();
  }, [selectedDate]);

  const handlePrevWeek = () => {
    const prev = new Date(monday);
    prev.setDate(prev.getDate() - 7);
    const s = prev.toISOString().split('T')[0];
    if (s >= '2026-09-21') onSelectDate(s);
  };

  const handleNextWeek = () => {
    const next = new Date(monday);
    next.setDate(next.getDate() + 7);
    const s = next.toISOString().split('T')[0];
    if (s <= '2026-12-31') onSelectDate(s);
  };

  return (
    <div className="space-y-3 animate-in fade-in">
      {/* Week Navigation Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={handlePrevWeek}
          aria-label="Previous week"
          className="p-2 text-slate-800 hover:text-black rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-wider text-blue-600">
            Week {currentWeekNumber} of 14
          </div>
          <div className="text-xs text-slate-900 font-bold mt-0.5">
            {monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
            {sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextWeek}
          aria-label="Next week"
          className="p-2 text-slate-800 hover:text-black rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week Day Cards */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold text-xs animate-pulse">
          Loading week schedule...
        </div>
      ) : (
        <div className="space-y-2.5">
          {weekDays.map((day) => {
            const isSelected = day.date === selectedDate;
            const isToday = day.date === '2026-09-22';

            return (
              <div
                key={day.date}
                onClick={() => onSelectDate(day.date)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold text-xs ${
                      day.isRestDay
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : isSelected
                        ? 'bg-blue-600 text-white font-black'
                        : 'bg-slate-100 text-slate-900 border border-slate-200'
                    }`}>
                      <span className="text-[10px] uppercase leading-none font-bold opacity-90">{day.dayName}</span>
                      <span className="text-sm leading-tight font-black mt-0.5">{day.date.split('-')[2]}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-slate-900">
                          {day.dayNumber ? `Day ${day.dayNumber}` : 'Break Day'}
                        </span>
                        {isToday && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mt-0.5">
                        {day.isRestDay ? (
                          <span className="text-xs text-amber-800 font-semibold flex items-center">
                            <Sparkles size={11} className="mr-1 text-amber-600" /> Puja Rest
                          </span>
                        ) : day.dayType === 'college' ? (
                          <span className="text-xs text-indigo-800 font-semibold flex items-center">
                            <GraduationCap size={11} className="mr-1 text-indigo-600" /> College Day (3.5h)
                          </span>
                        ) : (
                          <span className="text-xs text-slate-700 font-semibold">
                            Non-College (6h)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task Count & Progress Mini Bar */}
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900 flex items-center justify-end space-x-1">
                      <span>{day.completedCount}/{day.totalCount}</span>
                      {day.totalCount > 0 && day.completedCount === day.totalCount && (
                        <CheckCircle2 size={14} className="text-blue-600" />
                      )}
                    </div>
                    {day.totalCount > 0 ? (
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5 border border-slate-200">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${Math.round((day.completedCount / day.totalCount) * 100)}%` }}
                        />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">Rest</span>
                    )}
                  </div>
                </div>

                {/* Micro-preview of tasks if selected */}
                {isSelected && day.tasks.length > 0 && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 animate-in fade-in">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 block mb-1.5">
                      Scheduled Tasks:
                    </span>
                    {day.tasks.map(task => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenTaskDetails) onOpenTaskDetails(task);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-blue-500 hover:bg-blue-50/40 transition-colors shadow-2xs"
                      >
                        <span className={`truncate mr-2 font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </span>
                        <span className="text-xs text-slate-700 shrink-0 font-bold flex items-center">
                          <Clock size={12} className="mr-1 text-slate-500" /> {task.plannedMinutes}m
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
