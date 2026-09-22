import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { getDb } from '../../services/db';
import { StudySession, StudyTask } from '../../types';

interface HeatmapDay {
  dateStr: string;
  dayNumber: number;
  minutes: number;
  completedTasks: number;
  totalTasks: number;
  isRestDay: boolean;
  isToday: boolean;
}

export const CalendarHeatmap: React.FC = () => {
  const [heatmapDays, setHeatmapDays] = useState<HeatmapDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeatmapData() {
      setLoading(true);
      try {
        const db = await getDb();
        const days: HeatmapDay[] = [];
        const cur = new Date('2026-09-22T00:00:00');
        const end = new Date('2026-12-31T00:00:00');

        let dayCounter = 1;

        while (cur <= end) {
          const dStr = cur.toISOString().split('T')[0];
          const isRest = dStr >= '2026-10-17' && dStr <= '2026-10-21';

          let sessions: StudySession[] = [];
          let tasks: StudyTask[] = [];

          try {
            sessions = await db.getAllFromIndex('study_sessions', 'by_date', dStr);
          } catch {
            // Safe fallback
          }

          try {
            tasks = await db.getAllFromIndex('study_tasks', 'by_currentDate', dStr);
          } catch {
            // Safe fallback
          }

          const totalSecs = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
          const mins = Math.round(totalSecs / 60);
          const completed = tasks.filter(t => t.status === 'completed').length;

          days.push({
            dateStr: dStr,
            dayNumber: dayCounter,
            minutes: mins,
            completedTasks: completed,
            totalTasks: tasks.length,
            isRestDay: isRest,
            isToday: dStr === '2026-09-22'
          });

          cur.setDate(cur.getDate() + 1);
          dayCounter++;
        }

        setHeatmapDays(days);
      } catch (err) {
        console.error('Failed to load heatmap data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHeatmapData();
  }, []);

  const getCellClass = (day: HeatmapDay) => {
    if (day.isRestDay) {
      return 'bg-amber-100 border border-amber-300 text-amber-900';
    }
    if (day.minutes === 0) {
      return 'bg-slate-100 border border-slate-200 text-slate-700';
    }
    if (day.minutes < 120) {
      return 'bg-blue-200 border border-blue-300 text-blue-900';
    }
    if (day.minutes < 240) {
      return 'bg-blue-400 border border-blue-500 text-white font-bold';
    }
    return 'bg-blue-600 border border-blue-700 text-white font-black';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center space-x-1">
            <Calendar size={13} />
            <span>101-Day Consistency Matrix</span>
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-0.5">
            Study Heatmap (22 Sep – 31 Dec)
          </h3>
        </div>
        <span className="text-xs font-bold text-slate-700">
          101 Epochs
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
          Building consistency heatmap...
        </div>
      ) : (
        <>
          {/* Heatmap Grid */}
          <div className="overflow-x-auto pb-1">
            <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[340px]">
              {heatmapDays.map((day) => (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  title={`${day.dateStr} (Day ${day.dayNumber}): ${day.minutes}m focused, ${day.completedTasks}/${day.totalTasks} tasks`}
                  className={`w-3.5 h-3.5 rounded-sm transition-transform hover:scale-125 focus:scale-125 ${getCellClass(day)} ${
                    day.isToday ? 'ring-2 ring-blue-600 ring-offset-1 ring-offset-white' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-bold px-1">
            <div className="flex items-center space-x-1.5">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200" />
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-200" />
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-400" />
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
              <span>More</span>
            </div>

            <div className="flex items-center space-x-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-200 border border-amber-300" />
              <span>Puja Rest</span>
            </div>
          </div>

          {/* Selected Day Inspector */}
          {selectedDay && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900">
                  Day {selectedDay.dayNumber} • {selectedDay.dateStr}
                </span>
                {selectedDay.isRestDay ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center space-x-1">
                    <Sparkles size={11} />
                    <span>Protected Rest</span>
                  </span>
                ) : (
                  <span className="text-blue-700 font-bold font-mono">
                    {selectedDay.minutes} min focused
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {selectedDay.isRestDay
                  ? 'Durga Puja festival rest respected. Zero missed-day penalty.'
                  : `${selectedDay.completedTasks} of ${selectedDay.totalTasks} scheduled tasks completed.`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
