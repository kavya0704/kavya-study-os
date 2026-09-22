import React from 'react';
import { Check, RotateCcw, AlertTriangle, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { RevisionItem } from '../../types';

interface SpacedReviewCardProps {
  item: RevisionItem;
  currentDateStr: string;
  onGrade: (itemId: string, grade: 'strong' | 'needs_review' | 'blocked') => void;
}

export const SpacedReviewCard: React.FC<SpacedReviewCardProps> = ({
  item,
  currentDateStr,
  onGrade
}) => {
  const isCompleted = item.status === 'completed';
  const isDueToday = item.dueDate === currentDateStr;
  const isOverdue = item.dueDate < currentDateStr && !isCompleted;

  const getStageBadge = () => {
    switch (item.stage) {
      case 'day_1':
        return {
          label: 'Day +1 • 10m Recall',
          bg: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'day_3':
        return {
          label: 'Day +3 • 20m Transfer',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        };
      case 'day_7':
        return {
          label: 'Day +7 • 20m Defense',
          bg: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      default:
        return {
          label: 'Weekly Synthesis',
          bg: 'bg-slate-100 text-slate-800 border-slate-200'
        };
    }
  };

  const badge = getStageBadge();

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-150 ${
        isCompleted
          ? 'bg-slate-50/60 border-slate-200 opacity-60'
          : isOverdue
          ? 'bg-white border-rose-300 shadow-xs'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.bg}`}>
          <Sparkles size={11} className="mr-1" />
          {badge.label}
        </span>

        <div className="flex items-center space-x-1.5 text-xs font-bold">
          {isCompleted ? (
            <span className="inline-flex items-center text-blue-600 font-black">
              <CheckCircle2 size={13} className="mr-1" /> Done
            </span>
          ) : isDueToday ? (
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-black border border-blue-200">
              Due Today
            </span>
          ) : isOverdue ? (
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-black border border-rose-200">
              Overdue ({item.dueDate})
            </span>
          ) : (
            <span className="text-slate-600 flex items-center font-bold">
              <Clock size={12} className="mr-1 text-slate-400" /> {item.dueDate}
            </span>
          )}
        </div>
      </div>

      {/* Topic Title */}
      <h3 className={`text-sm font-black tracking-tight ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
        {item.topic}
      </h3>

      {/* Action Prompt */}
      <p className="text-xs text-slate-800 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
        {item.actionPrompt}
      </p>

      {/* Interactive Grading Actions */}
      {!isCompleted && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
          {/* Strong */}
          <button
            type="button"
            onClick={() => onGrade(item.id, 'strong')}
            className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-black active:scale-98 transition-all min-h-[38px]"
          >
            <Check size={13} strokeWidth={2.5} />
            <span>Strong</span>
          </button>

          {/* Needs Review */}
          <button
            type="button"
            onClick={() => onGrade(item.id, 'needs_review')}
            className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black active:scale-98 transition-all min-h-[38px]"
          >
            <RotateCcw size={12} />
            <span>Drill</span>
          </button>

          {/* Blocked */}
          <button
            type="button"
            onClick={() => onGrade(item.id, 'blocked')}
            className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-black active:scale-98 transition-all min-h-[38px]"
          >
            <AlertTriangle size={12} />
            <span>Blocked</span>
          </button>
        </div>
      )}
    </div>
  );
};
