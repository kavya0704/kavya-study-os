import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StudyDay, StudyTask } from '../../types';
import { getDb } from '../../services/db';

interface MonthCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onJumpToDay?: (date: string) => void;
}

interface MonthDayCell {
  dateStr: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isInRoadmap: boolean;
  isToday: boolean;
  isRestDay: boolean;
  dayNumber?: number;
  totalTasks: number;
  completedTasks: number;
}

const ROADMAP_START = '2026-09-22';
const ROADMAP_END = '2026-12-31';

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  selectedDate,
  onSelectDate,
  onJumpToDay
}) => {
  const initialDate = new Date(`${selectedDate}T00:00:00`);
  const currentYear = initialDate.getFullYear() || 2026;
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() || 8);
  const [monthCells, setMonthCells] = useState<MonthDayCell[]>([]);
  const [selectedDayTasks, setSelectedDayTasks] = useState<StudyTask[]>([]);
  const [selectedDayRecord, setSelectedDayRecord] = useState<StudyDay | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth > 8) {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth(prev => prev + 1);
    }
  };

  useEffect(() => {
    async function buildMonthGrid() {
      const db = await getDb();
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);

      const startDayOfWeek = (firstDay.getDay() + 6) % 7;

      const cells: MonthDayCell[] = [];

      // Pad preceding days
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
        const dStr = d.toISOString().split('T')[0];
        cells.push({
          dateStr: dStr,
          dayOfMonth: prevMonthLastDay - i,
          isCurrentMonth: false,
          isInRoadmap: dStr >= ROADMAP_START && dStr <= ROADMAP_END,
          isToday: dStr === '2026-09-22',
          isRestDay: dStr >= '2026-10-17' && dStr <= '2026-10-21',
          totalTasks: 0,
          completedTasks: 0
        });
      }

      // Days in current month
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const d = new Date(currentYear, currentMonth, day);
        const dStr = d.toISOString().split('T')[0];
        const inRoadmap = dStr >= ROADMAP_START && dStr <= ROADMAP_END;

        let totalTasks = 0;
        let completedTasks = 0;
        let dayNum: number | undefined;

        if (inRoadmap) {
          try {
            const tasks: StudyTask[] = await db.getAllFromIndex('study_tasks', 'by_currentDate', dStr);
            totalTasks = tasks.length;
            completedTasks = tasks.filter(t => t.status === 'completed').length;
          } catch {
            // Fallback
          }
          try {
            const dayRec: StudyDay | undefined = await db.get('study_days', `day-${dStr}`);
            dayNum = dayRec?.dayNumber;
          } catch {
            // Fallback
          }
        }

        cells.push({
          dateStr: dStr,
          dayOfMonth: day,
          isCurrentMonth: true,
          isInRoadmap: inRoadmap,
          isToday: dStr === '2026-09-22',
          isRestDay: dStr >= '2026-10-17' && dStr <= '2026-10-21',
          dayNumber: dayNum,
          totalTasks,
          completedTasks
        });
      }

      // Pad succeeding days to 42 cells
      const remaining = 42 - cells.length;
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(currentYear, currentMonth + 1, i);
        const dStr = d.toISOString().split('T')[0];
        cells.push({
          dateStr: dStr,
          dayOfMonth: i,
          isCurrentMonth: false,
          isInRoadmap: dStr >= ROADMAP_START && dStr <= ROADMAP_END,
          isToday: false,
          isRestDay: false,
          totalTasks: 0,
          completedTasks: 0
        });
      }

      setMonthCells(cells);
    }

    buildMonthGrid();
  }, [currentYear, currentMonth]);

  // Load selected day details
  useEffect(() => {
    async function loadSelectedDay() {
      try {
        const db = await getDb();
        let tasks: StudyTask[] = [];
        try {
          tasks = await db.getAllFromIndex('study_tasks', 'by_currentDate', selectedDate);
        } catch {
          const all = await db.getAll('study_tasks') as StudyTask[];
          tasks = all.filter(t => t.currentDate === selectedDate);
        }
        const dayRec: StudyDay | undefined = await db.get('study_days', `day-${selectedDate}`);
        setSelectedDayTasks(tasks);
        setSelectedDayRecord(dayRec || null);
      } catch (err) {
        console.error('Failed to load selected day in month calendar:', err);
      }
    }
    loadSelectedDay();
  }, [selectedDate]);

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const weekDayHeaders = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="space-y-3.5 animate-in fade-in">
      {/* Month Navigation Strip */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={currentMonth <= 8}
          className={`p-2 rounded-xl transition-colors ${
            currentMonth <= 8
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-700 hover:text-black hover:bg-slate-100'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-base font-black text-slate-900">{monthName}</h2>
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">
            101-Day AI/ML Window
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          disabled={currentMonth >= 11}
          className={`p-2 rounded-xl transition-colors ${
            currentMonth >= 11
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-700 hover:text-black hover:bg-slate-100'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-2.5">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDayHeaders.map((day, idx) => (
            <div key={idx} className="text-xs font-black text-slate-900 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-1.5">
          {monthCells.map((cell, idx) => {
            const isSelected = cell.dateStr === selectedDate;
            const isClickable = cell.isInRoadmap;

            return (
              <button
                key={idx}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSelectDate(cell.dateStr)}
                className={`relative h-12 rounded-xl flex flex-col items-center justify-center p-0.5 transition-all text-xs font-bold ${
                  !cell.isInRoadmap
                    ? 'text-slate-300 bg-transparent cursor-not-allowed'
                    : isSelected
                    ? 'bg-blue-600 text-white font-black shadow-sm'
                    : cell.isRestDay
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    : cell.isToday
                    ? 'bg-blue-50 text-blue-700 border-2 border-blue-600 font-black'
                    : cell.isCurrentMonth
                    ? 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
                    : 'text-slate-300 bg-transparent'
                }`}
              >
                <span className="text-xs font-black leading-none">{cell.dayOfMonth}</span>

                {/* Status Dot / Indicator */}
                {cell.isInRoadmap && (
                  <div className="mt-1 flex items-center justify-center">
                    {cell.isRestDay ? (
                      <span className="text-[9px] font-black leading-none text-amber-500">✨</span>
                    ) : cell.totalTasks > 0 && cell.completedTasks === cell.totalTasks ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    ) : cell.completedTasks > 0 ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-slate-400" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-bold px-1">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Complete</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Puja Rest</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Planned</span>
          </div>
        </div>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedDayRecord && (
        <div className="p-4 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-black text-slate-900">
                Day {selectedDayRecord.dayNumber} • {selectedDate}
              </span>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                {selectedDayRecord.isProtectedRestDay
                  ? '✨ Durga Puja Rest Day (Zero required study)'
                  : selectedDayRecord.dayType === 'college'
                  ? '🎓 College Day (3.5h study planned)'
                  : '🚀 Non-College Day (6h study planned)'}
              </p>
            </div>

            {onJumpToDay && (
              <button
                type="button"
                onClick={() => onJumpToDay(selectedDate)}
                className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
              >
                Go to Day
              </button>
            )}
          </div>

          <div className="space-y-2 pt-1">
            {selectedDayTasks.length === 0 ? (
              <div className="text-xs text-slate-500 italic">No tasks scheduled for this day.</div>
            ) : (
              selectedDayTasks.map(task => (
                <div
                  key={task.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                >
                  <span className={`truncate mr-2 font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                  <span className="text-xs text-slate-700 shrink-0 font-bold">
                    {task.plannedMinutes}m
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
