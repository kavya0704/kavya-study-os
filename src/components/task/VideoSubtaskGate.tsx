import React, { useState } from 'react';
import { 
  CheckSquare, 
  X, 
  AlertTriangle, 
  Github, 
  FileCode, 
  Brain, 
  BookOpen, 
  GitCommit, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { StudyTask, StudyTaskSubtasks } from '../../types';

interface VideoSubtaskGateProps {
  task: StudyTask;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    taskId: string, 
    subtasks: StudyTaskSubtasks, 
    proofUrl?: string, 
    mistakeNote?: string
  ) => void;
}

export const VideoSubtaskGate: React.FC<VideoSubtaskGateProps> = ({
  task,
  isOpen,
  onClose,
  onComplete
}) => {
  const initialSubtasks: StudyTaskSubtasks = task.subtasks || {
    watchedActively: false,
    recreatedExample: false,
    wroteRecallQuestions: false,
    solvedVariations: false,
    recordedDoubtOrMistake: false,
    committedProof: false
  };

  const [subtasks, setSubtasks] = useState<StudyTaskSubtasks>(initialSubtasks);
  const [proofUrl, setProofUrl] = useState(task.proofUrl || '');
  const [mistakeNote, setMistakeNote] = useState('');

  if (!isOpen) return null;

  const toggleSubtask = (key: keyof StudyTaskSubtasks) => {
    setSubtasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const subtaskItems: {
    key: keyof StudyTaskSubtasks;
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    {
      key: 'watchedActively',
      title: 'Active Viewing (No Passive Binging)',
      description: 'Paused at code demonstrations. No 2x rushing or background multitasking.',
      icon: BookOpen
    },
    {
      key: 'recreatedExample',
      title: 'Blank-Editor Recreation',
      description: 'Recreated the core code example from a completely blank file without looking at notes.',
      icon: FileCode
    },
    {
      key: 'wroteRecallQuestions',
      title: '3–5 Active Recall Questions',
      description: 'Formulated test questions exploring syntax pitfalls, time complexity, or edge cases.',
      icon: Brain
    },
    {
      key: 'solvedVariations',
      title: '1–3 Original Variations',
      description: 'Tested edge cases (empty collections, boundary values, custom data structures).',
      icon: CheckSquare
    },
    {
      key: 'recordedDoubtOrMistake',
      title: 'Logged Core Mistake or Doubt',
      description: 'Captured at least one misconception or debugging lesson in the personal error log.',
      icon: AlertTriangle
    },
    {
      key: 'committedProof',
      title: 'GitHub Commit Proof',
      description: 'Pushed clean, working code to your GitHub study repository with a clear message.',
      icon: GitCommit
    }
  ];

  const checkedCount = Object.values(subtasks).filter(Boolean).length;
  const isGateSatisfied = checkedCount === 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGateSatisfied) return;
    onComplete(task.id, subtasks, proofUrl.trim() || undefined, mistakeNote.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-amber-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
              <ShieldCheck size={18} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                Recovery Gate • Video #{task.backlogVideoNumber || '1'}
              </span>
              <h2 className="text-sm font-bold text-slate-900 truncate max-w-[260px]">
                {task.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Subtasks Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Strict Rule Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-slate-800 leading-relaxed">
            <strong className="text-amber-950 font-bold block mb-0.5">Strict Backlog Recovery Invariant:</strong>
            Per Section 4 of the PRD, video lessons may <em>never</em> be marked complete by passive watching. All 6 active practice checks and code proof are required.
          </div>

          {/* Progress Pill */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-900">Verification Checklist</span>
            <span className={`font-bold ${isGateSatisfied ? 'text-emerald-700' : 'text-amber-700'}`}>
              {checkedCount} of 6 Completed
            </span>
          </div>

          {/* 6 Subtasks List */}
          <div className="space-y-2.5">
            {subtaskItems.map((item) => {
              const Icon = item.icon;
              const isChecked = subtasks[item.key];

              return (
                <div
                  key={item.key}
                  onClick={() => toggleSubtask(item.key)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none min-h-[56px] ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <Icon size={14} className={isChecked ? 'text-emerald-700' : 'text-slate-600'} />
                      <h4 className={`text-xs font-bold ${isChecked ? 'text-emerald-950' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5 leading-snug font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Proof URL Input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Github size={14} className="text-slate-700" />
              <span>GitHub Commit / Repository Proof URL</span>
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://github.com/kavya/study-notes/commit/..."
              style={{ fontSize: '16px' }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors shadow-sm font-mono font-medium"
            />
          </div>

          {/* Key Mistake or Doubt Log Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Key Mistake / Takeaway (Logged to Error Tracker)</span>
            </label>
            <textarea
              value={mistakeNote}
              onChange={(e) => setMistakeNote(e.target.value)}
              rows={2}
              placeholder="e.g. Forgot that slicing creates a shallow copy, causing unexpected mutation..."
              style={{ fontSize: '16px' }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors resize-none shadow-sm font-medium"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 pb-safe">
            <button
              type="submit"
              disabled={!isGateSatisfied}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all min-h-[48px] ${
                isGateSatisfied
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-[0.98]'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold'
              }`}
            >
              {isGateSatisfied ? (
                <>
                  <Check size={18} strokeWidth={3} />
                  <span>Verify & Complete Video Lesson (6/6 Done)</span>
                </>
              ) : (
                <span>Complete All 6 Subtasks to Unlock ({checkedCount}/6)</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
