import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Clock, 
  CalendarDays, 
  CalendarRange 
} from 'lucide-react';
import { StudyTask } from '../types';
import { useTaskStore } from '../stores/useTaskStore';
import { getTodayDateString } from '../engines';
import { 
  DayPlanView, 
  WeekView, 
  MonthCalendar, 
  PhaseRoadmapView, 
  SafeRescheduleModal 
} from '../components/plan';
import { TaskDetailSheet } from '../components/task/TaskDetailSheet';

export type PlanMode = 'day' | 'week' | 'month' | 'roadmap';

interface PlanViewProps {
  onStartTimer?: (task: StudyTask) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({ onStartTimer }) => {
  const {
    currentDate,
    loadDate,
    toggleTask,
    rescheduleTask
  } = useTaskStore();

  const [activeMode, setActiveMode] = useState<PlanMode>('week');
  const [selectedDate, setSelectedDate] = useState(currentDate || getTodayDateString());
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<StudyTask | null>(null);
  const [selectedTaskForReschedule, setSelectedTaskForReschedule] = useState<StudyTask | null>(null);

  useEffect(() => {
    if (selectedDate !== currentDate) {
      loadDate(selectedDate);
    }
  }, [selectedDate, currentDate, loadDate]);

  const handleDateSelect = (newDate: string) => {
    setSelectedDate(newDate);
    loadDate(newDate);
  };

  const handleJumpToDay = (targetDate: string) => {
    setSelectedDate(targetDate);
    loadDate(targetDate);
    setActiveMode('day');
  };

  const handleStartTimerFromTask = (task: StudyTask) => {
    if (onStartTimer) {
      onStartTimer(task);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-28 space-y-3.5 animate-in fade-in">
      {/* Header & Segmented Mode Switcher */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Curriculum Planner</h1>
            <p className="text-xs text-slate-500">
              101-Day AI/ML Master Plan • Safe Pacing
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 uppercase">
            {activeMode === 'roadmap' ? '8 Phases' : activeMode} View
          </span>
        </div>

        {/* Segmented Control Bar */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 border border-slate-200 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveMode('day')}
            className={`py-2 px-1 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeMode === 'day'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock size={13} className={activeMode === 'day' ? 'text-blue-600' : ''} />
            <span>Day</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('week')}
            className={`py-2 px-1 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeMode === 'week'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarDays size={13} className={activeMode === 'week' ? 'text-blue-600' : ''} />
            <span>Week</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('month')}
            className={`py-2 px-1 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeMode === 'month'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarRange size={13} className={activeMode === 'month' ? 'text-blue-600' : ''} />
            <span>Month</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('roadmap')}
            className={`py-2 px-1 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1 ${
              activeMode === 'roadmap'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers size={13} className={activeMode === 'roadmap' ? 'text-blue-600' : ''} />
            <span>Roadmap</span>
          </button>
        </div>
      </div>

      {/* Plan Mode View Container */}
      <div className="pt-1">
        {activeMode === 'day' && (
          <DayPlanView
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            onStartTimer={handleStartTimerFromTask}
            onOpenTaskDetails={task => setSelectedTaskForDetails(task)}
            onOpenReschedule={task => setSelectedTaskForReschedule(task)}
          />
        )}

        {activeMode === 'week' && (
          <WeekView
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            onOpenTaskDetails={task => setSelectedTaskForDetails(task)}
          />
        )}

        {activeMode === 'month' && (
          <MonthCalendar
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            onJumpToDay={handleJumpToDay}
          />
        )}

        {activeMode === 'roadmap' && (
          <PhaseRoadmapView
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />
        )}
      </div>

      {/* Slide-Up Task Detail Sheet */}
      {selectedTaskForDetails && (
        <TaskDetailSheet
          task={selectedTaskForDetails}
          isOpen={!!selectedTaskForDetails}
          onClose={() => setSelectedTaskForDetails(null)}
          onStartTimer={task => {
            setSelectedTaskForDetails(null);
            handleStartTimerFromTask(task);
          }}
          onToggleComplete={taskId => {
            toggleTask(taskId);
            setSelectedTaskForDetails(null);
          }}
          onRescheduleTask={async (taskId: string, targetDate: string) => {
            return await rescheduleTask(taskId, targetDate);
          }}
        />
      )}

      {/* Safe Reschedule Modal */}
      {selectedTaskForReschedule && (
        <SafeRescheduleModal
          task={selectedTaskForReschedule}
          isOpen={!!selectedTaskForReschedule}
          onClose={() => setSelectedTaskForReschedule(null)}
          onSuccess={() => setSelectedTaskForReschedule(null)}
        />
      )}
    </div>
  );
};
