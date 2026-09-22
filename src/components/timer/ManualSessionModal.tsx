import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, Check, FileText } from 'lucide-react';
import { StudyTask } from '../../types';

interface ManualSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDateStr: string;
  availableTasks?: StudyTask[];
  onSaveSession: (
    date: string,
    durationMinutes: number,
    topic: string,
    note?: string,
    taskId?: string
  ) => Promise<void>;
}

export const ManualSessionModal: React.FC<ManualSessionModalProps> = ({
  isOpen,
  onClose,
  currentDateStr,
  availableTasks = [],
  onSaveSession
}) => {
  const [date, setDate] = useState(currentDateStr);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [topic, setTopic] = useState('College Library Offline Study');
  const [note, setNote] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickMinutes = [15, 30, 45, 60, 90, 120];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (durationMinutes <= 0 || !topic.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveSession(
        date,
        durationMinutes,
        topic.trim(),
        note.trim() || undefined,
        selectedTaskId || undefined
      );
      onClose();
    } catch (err) {
      console.error('Failed to save manual session:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    const matched = availableTasks.find(t => t.id === taskId);
    if (matched) {
      setTopic(matched.title);
      if (matched.plannedMinutes) {
        setDurationMinutes(matched.plannedMinutes);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Log Offline Study Session</h2>
              <p className="text-[11px] text-slate-700 font-medium">College library or offline problem solving</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Calendar size={13} className="text-blue-600" />
              <span>Session Date</span>
            </label>
            <input
              type="date"
              min="2026-09-22"
              max="2026-12-31"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ fontSize: '16px' }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 shadow-sm font-semibold"
            />
          </div>

          {/* Quick Duration Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Clock size={13} className="text-blue-600" />
                <span>Duration (Minutes)</span>
              </span>
              <span className="text-blue-600 font-mono font-bold text-sm">
                {durationMinutes} mins
              </span>
            </label>

            <div className="grid grid-cols-6 gap-1.5">
              {quickMinutes.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    durationMinutes === mins
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            <input
              type="range"
              min={10}
              max={240}
              step={5}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Optional Task Linking */}
          {availableTasks.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <BookOpen size={13} className="text-blue-600" />
                <span>Link to Scheduled Task (Optional)</span>
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => handleTaskSelect(e.target.value)}
                style={{ fontSize: '16px' }}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
              >
                <option value="">-- Standalone Study Session --</option>
                {availableTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.plannedMinutes}m)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Topic Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900">
              Topic / Activity Name
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Linear Algebra Problem Set 3"
              style={{ fontSize: '16px' }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
            />
          </div>

          {/* Note / Reflection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <FileText size={13} className="text-slate-600" />
              <span>Notes / Key Takeaways</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Summary of concepts learned or questions answered..."
              style={{ fontSize: '16px' }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 resize-none shadow-sm font-medium"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || durationMinutes <= 0}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.98] min-h-[48px]"
            >
              <Check size={18} strokeWidth={3} />
              <span>Log {durationMinutes} Minutes to Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
