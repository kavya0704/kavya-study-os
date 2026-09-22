import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  RotateCcw, 
  Play, 
  CheckCircle2
} from 'lucide-react';
import { StudyDay, StudyTask } from '../../types';
import { getDb } from '../../services/db';

interface DayPlanViewProps {
  currentDate?: string;
  selectedDate?: string;
  currentDay?: StudyDay | null;
  tasks?: StudyTask[];
  onDateChange?: (newDate: string) => void;
  onSelectDate?: (newDate: string) => void;
  onStartTimer: (task: StudyTask) => void;
  onOpenTaskDetails: (task: StudyTask) => void;
  onOpenReschedule: (task: StudyTask) => void;
  onToggleTask?: (taskId: string) => void;
}

export const DayPlanView: React.FC<DayPlanViewProps> = ({
  currentDate,
  selectedDate,
  currentDay: propCurrentDay,
  tasks: propTasks,
  onDateChange,
  onSelectDate,
  onStartTimer,
  onOpenTaskDetails,
  onOpenReschedule,
  onToggleTask
}) => {
  const activeDate = selectedDate || currentDate || '2026-09-22';
  const handleDateShift = onSelectDate || onDateChange || (() => {});

  const [dayRecord, setDayRecord] = useState<StudyDay | null>(propCurrentDay || null);
  const [dayTasks, setDayTasks] = useState<StudyTask[]>(propTasks || []);

  useEffect(() => {
    async function loadDay() {
      try {
        const db = await getDb();
        const dRec: StudyDay | undefined = await db.get('study_days', `day-${activeDate}`);
        setDayRecord(dRec || null);

        let tList: StudyTask[] = [];
        try {
          tList = await db.getAllFromIndex('study_tasks', 'by_currentDate', activeDate);
        } catch {
          const all = await db.getAll('study_tasks') as StudyTask[];
          tList = all.filter(t => t.currentDate === activeDate);
        }
        setDayTasks(tList);
      } catch (err) {
        console.error('Failed to load day plan:', err);
      }
    }

    if (!propTasks || propTasks.length === 0 || activeDate !== currentDate) {
      loadDay();
    } else {
      setDayTasks(propTasks);
      setDayRecord(propCurrentDay || null);
    }
  }, [activeDate, currentDate, propTasks, propCurrentDay]);

  const parsedDate = new Date(`${activeDate}T00:00:00`);
  const formattedDate = parsedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isRestDay = Boolean(
    dayRecord?.isProtectedRestDay ||
    (activeDate >= '2026-10-17' && activeDate <= '2026-10-21')
  );

  const isCollegeDay = dayRecord?.dayType === 'college';

  const handlePrev = () => {
    const d = new Date(`${activeDate}T00:00:00`);
    d.setDate(d.getDate() - 1);
    const s = d.toISOString().split('T')[0];
    if (s >= '2026-09-22') handleDateShift(s);
  };

  const handleNext = () => {
    const d = new Date(`${activeDate}T00:00:00`);
    d.setDate(d.getDate() + 1);
    const s = d.toISOString().split('T')[0];
    if (s <= '2026-12-31') handleDateShift(s);
  };

  const completedCount = dayTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-3.5 animate-in fade-in">
      {/* Date Navigation Strip */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous day"
          className="p-2 text-slate-800 hover:text-black rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-wider text-blue-600">
            {dayRecord ? `Day ${dayRecord.dayNumber} of 101` : 'Study Schedule'}
          </div>
          <h2 className="text-sm font-black text-slate-900 mt-0.5">{formattedDate}</h2>
          <div className="flex items-center justify-center space-x-1.5 mt-1">
            {isRestDay ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                ✨ Durga Puja Rest
              </span>
            ) : isCollegeDay ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
                🎓 College Day (3.5h)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                Non-College Day (6h)
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next day"
          className="p-2 text-slate-800 hover:text-black rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Durga Puja Celebration Banner */}
      {isRestDay && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-1 shadow-xs">
          <div className="flex items-center space-x-2 font-black text-xs text-amber-950">
            <Sparkles size={14} />
            <span>Protected Durga Puja Festival Break</span>
          </div>
          <p className="text-xs text-amber-900 font-medium leading-relaxed">
            Zero study tasks scheduled. Celebrate and enjoy time with family. StudyOS protects your streak and guarantees complete peace of mind.
          </p>
        </div>
      )}

      {/* Daily Schedule Structure & Commitments */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
          Daily Schedule Blocks
        </h3>

        <div className="grid grid-cols-1 gap-2 text-xs">
          {/* Gym Block */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <Dumbbell size={15} className="text-orange-600 shrink-0" />
              <span className="font-bold text-slate-900">Morning Gym & Fitness</span>
            </div>
            <span className="text-xs font-bold text-slate-700">06:30 – 07:45</span>
          </div>

          {/* College or Deep Work */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <GraduationCap size={15} className={isCollegeDay ? 'text-indigo-600' : 'text-blue-600'} />
              <span className="font-bold text-slate-900">
                {isCollegeDay ? 'College Lectures' : 'Morning Deep Work Block'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700">
              {isCollegeDay ? '09:00 – 16:00' : '09:00 – 14:00'}
            </span>
          </div>

          {/* Teaching Block */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <Briefcase size={15} className="text-purple-600 shrink-0" />
              <span className="font-bold text-slate-900">Teaching Commitment</span>
            </div>
            <span className="text-xs font-bold text-slate-700">16:30 – 18:00</span>
          </div>
        </div>
      </div>

      {/* Scheduled Tasks for Selected Day */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
            <Calendar size={13} className="text-blue-600" />
            <span>Scheduled Curriculum Tasks ({completedCount}/{dayTasks.length})</span>
          </h3>
        </div>

        {dayTasks.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-600 font-medium">
            {isRestDay ? 'Holiday break: Enjoy and recharge!' : 'No tasks scheduled for this date.'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayTasks.map((task) => {
              const isDone = task.status === 'completed';
              const isBacklog = task.category === 'masai_backlog';

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-slate-50/70 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => onOpenTaskDetails(task)}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isBacklog
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {isBacklog ? `Backlog #${task.backlogVideoNumber || '1'}` : task.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-700 font-bold flex items-center">
                          <Clock size={12} className="mr-0.5 text-slate-500" /> {task.plannedMinutes}m
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>

                      {task.topic && (
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5 truncate">
                          {task.topic}
                        </p>
                      )}
                    </div>

                    {/* Task Actions */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenReschedule(task)}
                        title="Reschedule to buffer date"
                        className="p-1.5 rounded-xl text-slate-700 hover:text-black hover:bg-slate-100 transition-colors active:scale-95"
                      >
                        <RotateCcw size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onStartTimer(task)}
                        title="Start timer"
                        className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors active:scale-95"
                      >
                        <Play size={14} fill="currentColor" />
                      </button>

                      {onToggleTask && (
                        <button
                          type="button"
                          onClick={() => onToggleTask(task.id)}
                          className={`p-1.5 rounded-xl transition-colors active:scale-95 ${
                            isDone ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
