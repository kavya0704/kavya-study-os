import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Clock, 
  CalendarDays, 
  CalendarRange 
} from 'lucide-react';
import { StudyTask } from '../types';
import { useTaskStore } from '../stores/useTaskStore';
import { ROADMAP_START, ROADMAP_END } from '../engines';
import { 
  DayPlanView, 
  WeekView, 
  MonthCalendar, 
  PhaseRoadmapView, 
  SafeRescheduleModal 
} from '../components/plan';
import { TaskDetailSheet } from '../components/task/TaskDetailSheet';

import { GsocView } from './GsocView';

export type PlanMode = 'day' | 'week' | 'month' | 'roadmap';
export type CurriculumTrack = 'aiml' | 'gsoc';

interface PlanViewProps {
  onStartTimer?: (task: StudyTask) => void;
  initialTrack?: CurriculumTrack;
}

export const PlanView: React.FC<PlanViewProps> = ({ 
  onStartTimer,
  initialTrack = 'aiml' 
}) => {
  const [activeTrack, setActiveTrack] = useState<CurriculumTrack>(initialTrack);
  const {
    currentDate,
    loadDate,
    toggleTask,
    rescheduleTask
  } = useTaskStore();

  const [activeMode, setActiveMode] = useState<PlanMode>('week');
  const defaultPlanDate = (currentDate >= ROADMAP_START && currentDate <= ROADMAP_END)
    ? currentDate
    : ROADMAP_START;
  const [selectedDate, setSelectedDate] = useState(defaultPlanDate);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<StudyTask | null>(null);
  const [selectedTaskForReschedule, setSelectedTaskForReschedule] = useState<StudyTask | null>(null);

  useEffect(() => {
    if (selectedDate !== currentDate && (selectedDate >= ROADMAP_START && selectedDate <= ROADMAP_END)) {
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

  if (activeTrack === 'gsoc') {
    return (
      <GsocView 
        onSwitchToAiml={() => setActiveTrack('aiml')} 
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 pb-28 space-y-4 animate-in fade-in">
      {/* Track Toggle: AI/ML 90-Day Sprint vs GSoC 2027 Hub */}
      <div className="flex items-center justify-between p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTrack('aiml')}
          className="flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all text-center bg-white text-blue-600 shadow-sm"
        >
          90-Day AI/ML Sprint
        </button>
        <button
          type="button"
          onClick={() => setActiveTrack('gsoc')}
          className="flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all text-center text-slate-600 hover:text-teal-700 hover:bg-slate-200/60"
        >
          GSoC 2027 Hub (32 Wks)
        </button>
      </div>

      {/* Header & Segmented Mode Switcher */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Curriculum Planner</h1>
            <p className="text-xs text-slate-500">
              90-Day AI Engineer Master Plan • 5.5h/day
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 uppercase">
            {activeMode === 'roadmap' ? '6 Phases' : activeMode} View
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
