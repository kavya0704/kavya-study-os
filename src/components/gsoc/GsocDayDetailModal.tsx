import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Play, 
  ExternalLink, 
  Plus, 
  Save, 
  Clock, 
  Coffee, 
  Link as LinkIcon 
} from 'lucide-react';
import { useGsocStore } from '../../stores/useGsocStore';
import { useTimerStore } from '../../stores/useTimerStore';
import { GSOC_RESOURCES } from '../../data/gsoc2027';
import { TaskProgress } from '../../types/gsoc';

interface GsocDayDetailModalProps {
  dayId: string | null;
  onClose: () => void;
}

export const GsocDayDetailModal: React.FC<GsocDayDetailModalProps> = ({ 
  dayId, 
  onClose 
}) => {
  const { 
    days, 
    progressMap, 
    toggleStepComplete, 
    saveDayNotes, 
    addEvidenceUrl 
  } = useGsocStore();

  const { startTimer } = useTimerStore();

  const day = days.find(d => d.id === dayId);
  const prog: TaskProgress = (dayId && progressMap[dayId]) ? progressMap[dayId] : {
    dayId: dayId || '',
    completedStepIds: [],
    status: 'not_started',
    notesMarkdown: '',
    evidenceUrls: [],
    completedAt: null,
    updatedAt: ''
  };

  const [notes, setNotes] = useState(prog.notesMarkdown || '');
  const [evidenceInput, setEvidenceInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!day) return null;

  const currentStepResourceIds = day.steps.flatMap(s => s.resourceRefs.map(r => r.resourceId));
  const dayResources = GSOC_RESOURCES.filter(r => currentStepResourceIds.includes(r.id));
  const completedCount = prog.completedStepIds.length;
  const totalSteps = day.steps.length;

  const handleSaveNotes = async () => {
    await saveDayNotes(day.id, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceInput.trim()) return;
    await addEvidenceUrl(day.id, evidenceInput.trim());
    setEvidenceInput('');
  };

  const handleStartTimer = () => {
    startTimer(
      undefined,
      `GSoC: ${day.title}`,
      'stopwatch',
      'gsoc2027',
      day.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                {day.id.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {day.targetDate}
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                <Clock size={12} />
                <span>{day.coreMinutes} mins</span>
              </span>
              {(day.type === 'rest' || day.type === 'buffer') && (
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center space-x-1">
                  <Coffee size={12} />
                  <span>Rest / Buffer</span>
                </span>
              )}
            </div>

            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
              {day.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {day.phaseId.replace('gsoc-phase-', 'Phase ')} • Week {day.weekNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Quick Timer Button */}
          <button
            onClick={handleStartTimer}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-sm transition-all active:scale-95"
          >
            <Play size={15} fill="currentColor" />
            <span>Launch Focus Timer For This Target</span>
          </button>

          {/* Steps Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Daily Steps ({completedCount}/{totalSteps})
              </h3>
              <span className="text-xs font-bold text-teal-600">
                {totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0}% Complete
              </span>
            </div>

            <div className="space-y-2">
              {day.steps.map((step, idx) => {
                const isStepDone = prog.completedStepIds.includes(step.id);
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStepComplete(day.id, step.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                      isStepDone 
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-700' 
                        : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-teal-600 shrink-0"
                      aria-label="Toggle step"
                    >
                      {isStepDone ? (
                        <CheckCircle2 size={18} className="text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle size={18} className="text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${isStepDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {idx + 1}. {step.kind.toUpperCase()}: {step.text}
                        </span>
                        {step.plannedMinutes && (
                          <span className="text-[10px] font-bold text-slate-400">
                            ~{step.plannedMinutes}m
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isStepDone ? 'text-slate-500' : 'text-slate-600'}`}>
                        Done when: {step.doneWhen}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          {dayResources.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Referenced Study Materials
              </h3>

              <div className="space-y-2">
                {dayResources.map(res => (
                  <a
                    key={res.id}
                    href={res.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {res.type.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate">
                          {res.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {res.channelOrPublisher || res.type}
                      </p>
                    </div>
                    <ExternalLink size={15} className="text-slate-400 group-hover:text-teal-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Evidence URLs */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Proof of Work & URLs</span>
              <span className="text-[11px] font-normal text-slate-500">PRs, Commits, Gists</span>
            </h3>

            {/* Evidence List */}
            {prog.evidenceUrls.length > 0 ? (
              <div className="space-y-1.5">
                {prog.evidenceUrls.map((url, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-600 hover:underline flex items-center space-x-1.5 truncate max-w-[85%]"
                    >
                      <LinkIcon size={12} className="shrink-0" />
                      <span className="truncate">{url}</span>
                    </a>
                    <ExternalLink size={12} className="text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No evidence links attached yet.</p>
            )}

            {/* Add Evidence Form */}
            <form onSubmit={handleAddEvidence} className="flex items-center space-x-2">
              <input
                type="url"
                value={evidenceInput}
                onChange={e => setEvidenceInput(e.target.value)}
                placeholder="https://github.com/.../pull/123"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!evidenceInput.trim()}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white font-bold text-xs flex items-center space-x-1 transition-colors"
              >
                <Plus size={14} />
                <span>Attach</span>
              </button>
            </form>
          </div>

          {/* Daily Notes & Learnings */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Daily Study Notes & Learnings
              </h3>
              {savedSuccess && (
                <span className="text-[11px] font-bold text-emerald-600 animate-in fade-in">
                  Saved successfully!
                </span>
              )}
            </div>

            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Record your breakthroughs, blockers encountered, mentor feedback, or code architecture observations..."
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <Save size={14} />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
