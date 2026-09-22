import React, { useState } from 'react';
import { Play, Clock, Link2, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StudyTask, StudyTaskSubtasks } from '../../types';
import { Checkbox } from '../common/Checkbox';

interface TaskCardProps {
  task: StudyTask;
  onToggleTask: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, key: keyof StudyTaskSubtasks) => void;
  onStartTimer: (task: StudyTask) => void;
  onOpenDetails?: (task: StudyTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleTask,
  onToggleSubtask,
  onStartTimer,
  onOpenDetails
}) => {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = task.status === 'completed';

  const getTagBadge = () => {
    if (task.title.toLowerCase().includes('coding proof')) {
      return {
        label: 'Practice',
        className: 'bg-purple-50 text-purple-600'
      };
    }
    switch (task.category) {
      case 'python_practice':
        return {
          label: 'Python',
          className: 'bg-blue-50 text-blue-600'
        };
      case 'masai_live':
        return {
          label: 'Masai Live',
          className: 'bg-sky-50 text-sky-600'
        };
      case 'masai_backlog':
        return {
          label: `Backlog #${task.backlogVideoNumber || '1'}`,
          className: 'bg-amber-50 text-amber-700'
        };
      case 'dsa_sql':
        return {
          label: 'DSA & SQL',
          className: 'bg-emerald-50 text-emerald-600'
        };
      case 'ml_theory':
        return {
          label: 'ML Theory',
          className: 'bg-indigo-50 text-indigo-600'
        };
      case 'recall':
        return {
          label: 'Recall',
          className: 'bg-amber-50 text-amber-600'
        };
      default:
        return {
          label: 'Study',
          className: 'bg-slate-100 text-slate-600'
        };
    }
  };

  const badge = getTagBadge();
  const linkedResourcesCount = task.resourceIds?.length || 0;

  // Subtask completion stats for backlog tasks
  const subtasks = task.subtasks;
  const subtaskCount = subtasks
    ? Object.values(subtasks).filter(Boolean).length
    : 0;
  const totalSubtasks = 6;
  const allSubtasksDone = subtaskCount === totalSubtasks;

  const subtaskLabels: { key: keyof StudyTaskSubtasks; label: string }[] = [
    { key: 'watchedActively', label: '1. Watched actively & paused at code demos' },
    { key: 'recreatedExample', label: '2. Recreated demo from blank file' },
    { key: 'wroteRecallQuestions', label: '3. Wrote 3–5 active recall questions' },
    { key: 'solvedVariations', label: '4. Solved 1 edge-case transfer variation' },
    { key: 'recordedDoubtOrMistake', label: '5. Logged mistake or core takeaway' },
    { key: 'committedProof', label: '6. Committed and pushed code proof to GitHub' },
  ];

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-150 p-4 ${
        isCompleted
          ? 'border-slate-100 opacity-60'
          : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Checkbox */}
        <div className="pt-0.5 shrink-0">
          <Checkbox
            checked={isCompleted}
            onChange={() => onToggleTask(task.id)}
            ariaLabel={`Complete task ${task.title}`}
          />
        </div>

        {/* Center Content */}
        <div className="flex-1 min-w-0">
          {/* Badge & Duration Row */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
              {badge.label}
            </span>

            <span className="inline-flex items-center text-xs text-slate-500 font-normal">
              <Clock size={12} className="mr-1 text-slate-400" />
              {task.plannedMinutes} min
            </span>
          </div>

          {/* Task Title */}
          <h3
            onClick={() => onOpenDetails && onOpenDetails(task)}
            className={`text-sm font-bold mt-1.5 leading-snug cursor-pointer ${
              isCompleted ? 'line-through text-slate-400' : 'text-slate-900 hover:text-blue-600'
            }`}
          >
            {task.title}
          </h3>

          {/* Linked Resources */}
          {linkedResourcesCount > 0 && (
            <div
              onClick={() => onOpenDetails && onOpenDetails(task)}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-medium mt-2 cursor-pointer select-none"
            >
              <Link2 size={13} className="text-blue-500" />
              <span>
                {linkedResourcesCount} linked resource{linkedResourcesCount > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Backlog Subtasks indicator */}
          {task.category === 'masai_backlog' && subtasks && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2 py-0.5 rounded-lg border transition-all ${
                  allSubtasksDone
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {allSubtasksDone ? (
                  <CheckCircle2 size={12} className="text-blue-600 shrink-0" />
                ) : (
                  <AlertCircle size={12} className="text-amber-500 shrink-0" />
                )}
                <span>Subtasks: {subtaskCount}/{totalSubtasks}</span>
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          )}
        </div>

        {/* Right Circular Play Button */}
        <button
          type="button"
          onClick={() => onStartTimer(task)}
          aria-label={`Start timer for ${task.title}`}
          className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95 shadow-xs"
        >
          <Play size={13} fill="currentColor" className="ml-0.5" />
        </button>
      </div>

      {/* Expandable Subtask Checklist for Backlog Videos */}
      {expanded && task.category === 'masai_backlog' && subtasks && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 bg-slate-50 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Mandatory Backlog Verification (6 Subtasks)
          </p>
          {subtaskLabels.map(({ key, label }) => (
            <div
              key={key}
              onClick={() => onToggleSubtask && onToggleSubtask(task.id, key)}
              className="flex items-center space-x-2 cursor-pointer py-0.5 select-none"
            >
              <div className="shrink-0">
                <Checkbox
                  checked={Boolean(subtasks[key])}
                  onChange={() => onToggleSubtask && onToggleSubtask(task.id, key)}
                  ariaLabel={label}
                  size="sm"
                />
              </div>
              <span className={`text-xs ${subtasks[key] ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
