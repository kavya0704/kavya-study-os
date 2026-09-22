import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { getDb } from '../../services/db';
import { StudySession, StudyDay } from '../../types';

interface DayMinutesData {
  date: string;
  dayLabel: string;
  dayNumber: number;
  minutes: number;
  isRestDay: boolean;
  isToday: boolean;
  plannedMinutes: number;
}

interface WeeklyMinutesChartProps {
  currentDate?: string;
}

export const WeeklyMinutesChart: React.FC<WeeklyMinutesChartProps> = ({
  currentDate = '2026-09-22'
}) => {
  const [weekData, setWeekData] = useState<DayMinutesData[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeekMinutes() {
      setLoading(true);
      const db = await getDb();

      const daysList: DayMinutesData[] = [];
      const cur = new Date(`${currentDate}T00:00:00`);
      cur.setDate(cur.getDate() - 6);

      let sumMinutes = 0;

      for (let i = 0; i < 7; i++) {
        const dStr = cur.toISOString().split('T')[0];
        const dayRecord: StudyDay | undefined = await db.get('study_days', `day-${dStr}`);
        const sessions: StudySession[] = await db.getAllFromIndex('study_sessions', 'by_date', dStr);

        const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
        const mins = Math.round(totalSeconds / 60);
        sumMinutes += mins;

        const isRest = Boolean(
          dayRecord?.isProtectedRestDay ||
          (dStr >= '2026-10-17' && dStr <= '2026-10-21')
        );

        daysList.push({
          date: dStr,
          dayLabel: cur.toLocaleDateString('en-US', { weekday: 'narrow' }),
          dayNumber: dayRecord?.dayNumber || 0,
          minutes: mins,
          isRestDay: isRest,
          isToday: dStr === currentDate,
          plannedMinutes: dayRecord?.plannedMinutes || (dayRecord?.dayType === 'college' ? 210 : 360)
        });

        cur.setDate(cur.getDate() + 1);
      }

      setWeekData(daysList);
      setTotalMinutes(sumMinutes);
      setLoading(false);
    }

    loadWeekMinutes();
  }, [currentDate]);

  const maxMinutes = Math.max(240, ...weekData.map(d => d.minutes));

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
      {/* Header with Weekly Total */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center space-x-1">
            <TrendingUp size={13} />
            <span>7-Day Focused Velocity</span>
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-0.5">
            Weekly Focus Volume
          </h3>
        </div>
        <div className="text-right">
          <span className="text-base font-black text-slate-900 font-mono">
            {(totalMinutes / 60).toFixed(1)}h
          </span>
          <span className="block text-[11px] text-slate-600 font-bold">Total Logged</span>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
          Calculating study sessions...
        </div>
      ) : (
        <>
          {/* Responsive SVG Bar Chart */}
          <div className="pt-2 pb-1">
            <div className="flex items-end justify-between h-36 gap-2 px-1">
              {weekData.map((d) => {
                const heightPercent = maxMinutes > 0 ? Math.round((d.minutes / maxMinutes) * 100) : 0;

                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Duration label */}
                    <span className="text-[10px] font-black text-slate-800 mb-1 font-mono">
                      {d.isRestDay ? 'Rest' : d.minutes > 0 ? `${d.minutes}m` : '0m'}
                    </span>

                    {/* Bar track and fill */}
                    <div className="w-full max-w-[28px] h-24 bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end p-0.5 border border-slate-200">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          d.isRestDay
                            ? 'bg-amber-400 h-full'
                            : d.isToday
                            ? 'bg-blue-600'
                            : d.minutes > 0
                            ? 'bg-blue-500'
                            : 'bg-slate-300 h-1'
                        }`}
                        style={{ height: d.isRestDay ? '100%' : `${Math.max(4, heightPercent)}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span className={`text-xs font-black mt-1.5 ${
                      d.isToday
                        ? 'text-blue-600'
                        : d.isRestDay
                        ? 'text-amber-700'
                        : 'text-slate-900'
                    }`}>
                      {d.dayLabel}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 leading-none">
                      {d.date.split('-')[2]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accessible Data Summary Table */}
          <div className="pt-2 border-t border-slate-100">
            <details className="text-xs text-slate-700 cursor-pointer">
              <summary className="text-[11px] font-black uppercase tracking-wider text-slate-900 hover:text-blue-600">
                View Detailed 7-Day Session Table
              </summary>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-900">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-black">
                      <th className="py-1.5">Date</th>
                      <th className="py-1.5">Actual</th>
                      <th className="py-1.5">Target</th>
                      <th className="py-1.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekData.map(d => (
                      <tr key={d.date} className="border-b border-slate-100 font-medium">
                        <td className="py-1.5 font-mono font-bold text-slate-900">{d.date}</td>
                        <td className="py-1.5 font-black text-slate-900">{d.minutes}m</td>
                        <td className="py-1.5 text-slate-600 font-bold">{d.plannedMinutes}m</td>
                        <td className="py-1.5 text-right">
                          {d.isRestDay ? (
                            <span className="text-amber-700 font-bold">Puja Rest</span>
                          ) : d.minutes >= d.plannedMinutes ? (
                            <span className="text-emerald-600 font-black">✓ Met</span>
                          ) : (
                            <span className="text-slate-500 font-semibold">In Progress</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </>
      )}
    </div>
  );
};
