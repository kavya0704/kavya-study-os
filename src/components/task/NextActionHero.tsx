import React from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { StudyTask } from '../../types';

interface NextActionHeroProps {
  task: StudyTask | undefined;
  onStartTimer: (task: StudyTask) => void;
  onToggleComplete: (taskId: string) => void;
  isRestDay?: boolean;
}

export const NextActionHero: React.FC<NextActionHeroProps> = ({
  task,
  onStartTimer,
  onToggleComplete,
  isRestDay = false
}) => {
  if (isRestDay) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <span className="text-xs font-semibold text-amber-600">Rest Day</span>
        <h3 className="text-base font-bold text-slate-900 mt-1">Durga Puja Break</h3>
        <p className="text-xs text-slate-500 mt-1">Zero study required. Celebrate and recharge!</p>
      </div>
    );
  }

  if (!task || task.status === 'completed') {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <span className="text-xs font-semibold text-blue-600">Complete</span>
        <h3 className="text-base font-bold text-slate-900 mt-1">All Tasks Done for Today!</h3>
        <p className="text-xs text-slate-500 mt-1">Great job! All planned daily tasks have been completed.</p>
      </div>
    );
  }

  const getCategoryLabel = () => {
    switch (task.category) {
      case 'masai_live':
        return 'Masai Live';
      case 'masai_backlog':
        return `Masai Backlog #${task.backlogVideoNumber || '1'}`;
      case 'python_practice':
        return 'Python Practice';
      case 'dsa_sql':
        return 'DSA & SQL';
      case 'ml_theory':
        return 'ML Theory';
      case 'recall':
        return 'Spaced Recall';
      default:
        return 'Study Focus';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
      {/* Top Header */}
      <div className="text-xs font-semibold text-slate-400">
        Next up
      </div>

      {/* Task Title */}
      <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug tracking-tight">
        {task.title}
      </h2>

      {/* Subtitle / Category & Duration */}
      <div className="text-xs text-slate-500 font-medium mt-1 mb-4">
        {getCategoryLabel()} • {task.plannedMinutes} min
      </div>

      {/* Dual CTA Buttons */}
      <div className="flex items-center gap-3">
        {/* Start Focus Button */}
        <button
          type="button"
          onClick={() => onStartTimer(task)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all min-h-[44px]"
        >
          <Play size={16} strokeWidth={2} />
          <span>Start Focus</span>
        </button>

        {/* Mark Complete Button */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-semibold text-sm rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-all min-h-[44px]"
        >
          <CheckCircle2 size={16} className="text-slate-800" strokeWidth={1.8} />
          <span>Mark Complete</span>
        </button>
      </div>
    </div>
  );
};
