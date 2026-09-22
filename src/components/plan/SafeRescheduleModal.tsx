import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { StudyTask } from '../../types';
import { useTaskStore } from '../../stores/useTaskStore';
import { validateReschedule, getRecommendedBufferDate } from '../../engines/rescheduleEngine';
import { getTasksForDate } from '../../services/db';

interface SafeRescheduleModalProps {
  task: StudyTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SafeRescheduleModal: React.FC<SafeRescheduleModalProps> = ({
  task,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [targetDate, setTargetDate] = useState('');
  const [validationResult, setValidationResult] = useState<{ allowed: boolean; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { rescheduleTask } = useTaskStore();

  useEffect(() => {
    if (task && isOpen) {
      setTargetDate(task.currentDate);
      setValidationResult(null);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleDateChange = async (newDate: string) => {
    setTargetDate(newDate);
    if (!newDate) {
      setValidationResult(null);
      return;
    }

    const tasksOnTarget = await getTasksForDate(newDate);
    const result = validateReschedule(task, newDate, tasksOnTarget);

    if (result.allowed) {
      setValidationResult({
        allowed: true,
        text: result.impactMessage || 'Target date is safe. Zero schedule conflicts detected.'
      });
    } else {
      setValidationResult({
        allowed: false,
        text: result.reason || 'Rescheduling blocked by system guardrails.'
      });
    }
  };

  const handleSuggestBuffer = () => {
    const buffer = getRecommendedBufferDate(task.currentDate);
    handleDateChange(buffer);
  };

  const handleConfirm = async () => {
    if (!targetDate || !validationResult?.allowed) return;
    setIsSubmitting(true);

    const res = await rescheduleTask(task.id, targetDate);
    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setValidationResult({
        allowed: false,
        text: res.error || 'Failed to reschedule task.'
      });
    }
  };

  const isBacklog = task.category === 'masai_backlog';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <RotateCcw size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Safe Task Rescheduling</h2>
              <p className="text-xs text-slate-700 font-medium">Guaranteed anti-cramming & buffer day routing</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Target Task Details */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                isBacklog ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {isBacklog ? `Backlog Video #${task.backlogVideoNumber || '1'}` : task.category.replace('_', ' ')}
              </span>
              <span className="text-xs font-bold text-slate-600">
                Currently on {task.currentDate}
              </span>
            </div>
            <h3 className="text-xs font-black text-slate-900 leading-snug">
              {task.title}
            </h3>
          </div>

          {/* Target Date Picker */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Choose New Target Date
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                min="2026-09-22"
                max="2026-12-31"
                value={targetDate}
                onChange={(e) => handleDateChange(e.target.value)}
                style={{ fontSize: '16px' }}
                className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleSuggestBuffer}
                className="px-3.5 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-black hover:bg-blue-100 transition-colors shrink-0"
              >
                Buffer Day
              </button>
            </div>
          </div>

          {/* Validation Feedback Card */}
          {validationResult && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start space-x-2.5 ${
                validationResult.allowed
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {validationResult.allowed ? (
                <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-bold">{validationResult.text}</span>
            </div>
          )}

          {/* Anti-Guilt Rules Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium space-y-1">
            <span className="font-black text-slate-900 block">System Guardrails Enforced:</span>
            <p>• 17–21 Oct Durga Puja days are protected rest: tasks cannot be shifted there.</p>
            <p>• Strict 1 Masai backlog video per day: double-video days are prohibited.</p>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!validationResult?.allowed || isSubmitting}
              onClick={handleConfirm}
              className={`py-2.5 px-4 rounded-xl font-black text-xs transition-colors shadow-sm ${
                validationResult?.allowed && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Rescheduling...' : 'Confirm Move'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
