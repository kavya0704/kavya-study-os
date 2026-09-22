import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  BookOpen, 
  Play, 
  AlertCircle, 
  CheckCheck,
  FileEdit,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { StudyTask, Resource } from '../../types';
import allResourcesSeed from '../../data/seeds/resources.json';
import { validateReschedule, getRecommendedBufferDate } from '../../engines/rescheduleEngine';
import { MarkdownEditor } from '../notes/MarkdownEditor';
import { useNoteStore } from '../../stores/useNoteStore';
import { AIRecallButton } from '../ai/AIRecallButton';
import { AIAnalogySheet } from '../ai/AIAnalogySheet';
import { AIDiagnosticModal } from '../ai/AIDiagnosticModal';

interface TaskDetailSheetProps {
  task: StudyTask | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (task: StudyTask) => void;
  onToggleComplete: (taskId: string) => void;
  onRescheduleTask?: (taskId: string, targetDate: string) => Promise<{ success: boolean; error?: string }>;
  existingTasksOnTargetDate?: StudyTask[];
}

export const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
  task,
  isOpen,
  onClose,
  onStartTimer,
  onToggleComplete,
  onRescheduleTask,
  existingTasksOnTargetDate = []
}) => {
  const [showReschedule, setShowReschedule] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [rescheduleMessage, setRescheduleMessage] = useState<{ allowed: boolean; text: string } | null>(null);
  const [taskNoteContent, setTaskNoteContent] = useState('');
  const [showErrorLogger, setShowErrorLogger] = useState(false);
  const [errorSymptom, setErrorSymptom] = useState('');
  const [errorRootCause, setErrorRootCause] = useState('');
  const [errorCodeFix, setErrorCodeFix] = useState('');
  const [errorLesson, setErrorLesson] = useState('');
  const [errorLoggedSuccess, setErrorLoggedSuccess] = useState(false);

  // AI Modal States
  const [showAnalogySheet, setShowAnalogySheet] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  const { notes, loadNotesForTask, saveNote, logError } = useNoteStore();

  useEffect(() => {
    if (task && isOpen) {
      loadNotesForTask(task.id);
    }
  }, [task, isOpen, loadNotesForTask]);

  useEffect(() => {
    if (notes && notes.length > 0) {
      setTaskNoteContent(notes[0].bodyMarkdown || '');
    } else {
      setTaskNoteContent('');
    }
  }, [notes]);

  if (!isOpen || !task) return null;

  // Resolve linked resources from seed
  const linkedResources: Resource[] = (task.resourceIds || [])
    .map(id => (allResourcesSeed as Resource[]).find(r => r.id === id))
    .filter((r): r is Resource => Boolean(r));

  const isCompleted = task.status === 'completed';

  const handleValidateTargetDate = (dateStr: string) => {
    setTargetDate(dateStr);
    if (!dateStr) {
      setRescheduleMessage(null);
      return;
    }

    const validation = validateReschedule(task, dateStr, existingTasksOnTargetDate);
    if (!validation.allowed) {
      setRescheduleMessage({ allowed: false, text: validation.reason || 'Cannot reschedule to this date.' });
    } else {
      setRescheduleMessage({ allowed: true, text: 'Safe buffer date confirmed (cap < 6 hrs).' });
    }
  };

  const handleExecuteReschedule = async () => {
    if (!onRescheduleTask || !targetDate) return;
    const res = await onRescheduleTask(task.id, targetDate);
    if (res.success) {
      setShowReschedule(false);
      onClose();
    } else {
      setRescheduleMessage({ allowed: false, text: res.error || 'Failed to reschedule.' });
    }
  };

  const handleSaveNote = async (content: string) => {
    setTaskNoteContent(content);
    await saveNote({
      taskId: task.id,
      title: `Notes: ${task.title}`,
      bodyMarkdown: content,
      type: 'task_note'
    });
  };

  const handleLogErrorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorSymptom.trim()) return;

    await logError({
      taskId: task.id,
      symptom: errorSymptom.trim(),
      rootCause: errorRootCause.trim(),
      codeFix: errorCodeFix.trim(),
      lesson: errorLesson.trim(),
      topic: task.topic || task.title
    });

    setErrorLoggedSuccess(true);
    setErrorSymptom('');
    setErrorRootCause('');
    setErrorCodeFix('');
    setErrorLesson('');
    setTimeout(() => {
      setErrorLoggedSuccess(false);
      setShowErrorLogger(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
              {task.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-500 flex items-center">
              <Clock size={12} className="mr-1" /> {task.plannedMinutes}m
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Title & AI Concept Analogy Trigger */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {task.title}
              </h2>
              <button
                type="button"
                onClick={() => setShowAnalogySheet(true)}
                className="shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-colors"
                title="Explain with real-world analogy"
              >
                <Lightbulb size={13} className="text-amber-500" />
                <span>Analogy</span>
              </button>
            </div>
            {task.topic && (
              <p className="text-xs text-blue-600 font-medium mt-1">
                Topic: {task.topic}
              </p>
            )}
          </div>

          {/* Definition of Done */}
          <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-1.5">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs">
              <CheckCheck size={15} />
              <span>Definition of Done</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {task.definitionOfDone || 'Complete all subtasks, code proofs, and verify working behavior.'}
            </p>
          </div>

          {/* Task Instructions */}
          {task.description && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Instructions & Context
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {task.description}
              </p>
            </div>
          )}

          {/* Linked Resources */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <BookOpen size={13} className="text-blue-600" />
              <span>Curated Learning Resources ({linkedResources.length})</span>
            </span>

            {linkedResources.length === 0 ? (
              <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                No external resource links attached. Follow task instructions.
              </div>
            ) : (
              <div className="space-y-2">
                {linkedResources.map((res) => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-blue-600 px-1.5 py-0.5 rounded bg-blue-50">
                          {res.type}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {res.provider} • {res.language}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 mt-1 truncate">
                        {res.title}
                      </h4>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Task-Specific Markdown Notes & Scratchpad */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <FileEdit size={13} className="text-blue-600" />
                <span>Task Notes & Scratchpad</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowDiagnosticModal(true)}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                >
                  <AlertTriangle size={12} />
                  <span>AI Bug Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowErrorLogger(!showErrorLogger)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  {showErrorLogger ? 'Hide Manual Log' : 'Manual Log'}
                </button>
              </div>
            </div>

            {/* AI Active Recall Question Generator Helper Button */}
            <AIRecallButton
              topic={task.topic || task.title}
              onQuestionsGenerated={(questions: string) => {
                const combined = taskNoteContent 
                  ? `${taskNoteContent}\n\n### Spaced Retrieval Questions\n${questions}` 
                  : `### Spaced Retrieval Questions\n${questions}`;
                handleSaveNote(combined);
              }}
            />

            {/* Inline Markdown Editor */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
              <MarkdownEditor
                initialValue={taskNoteContent}
                onSave={handleSaveNote}
                placeholder="Log active recall questions, formula summaries, code snippets..."
              />
            </div>

            {/* Manual Error Log Drawer */}
            {showErrorLogger && (
              <form onSubmit={handleLogErrorSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 mt-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <AlertCircle size={13} className="text-amber-500" />
                    <span>Log Bug to Error Journal</span>
                  </span>
                  {errorLoggedSuccess && (
                    <span className="text-[11px] text-blue-600 font-bold">✓ Logged!</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Error Symptom</label>
                  <input
                    type="text"
                    value={errorSymptom}
                    onChange={(e) => setErrorSymptom(e.target.value)}
                    placeholder="e.g. ValueError: Found input variables with inconsistent numbers of samples"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Root Cause (Why it broke)</label>
                  <input
                    type="text"
                    value={errorRootCause}
                    onChange={(e) => setErrorRootCause(e.target.value)}
                    placeholder="e.g. Passed X_train with 80 rows but y_train had 100 rows"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Code Fix</label>
                  <input
                    type="text"
                    value={errorCodeFix}
                    onChange={(e) => setErrorCodeFix(e.target.value)}
                    placeholder="e.g. train_test_split(X, y, random_state=42)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Mental Model / Preventative Rule</label>
                  <input
                    type="text"
                    value={errorLesson}
                    onChange={(e) => setErrorLesson(e.target.value)}
                    placeholder="e.g. Always assert X.shape[0] == y.shape[0] before fit"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Save Error to Journal
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Safe Reschedule Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowReschedule(!showReschedule);
                  if (!targetDate) {
                    const recommended = getRecommendedBufferDate(task.currentDate);
                    handleValidateTargetDate(recommended);
                  }
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1.5 transition-colors"
              >
                <Calendar size={13} className="text-blue-600" />
                <span>{showReschedule ? 'Cancel Reschedule' : 'Safe Reschedule Task'}</span>
              </button>

              <span className="text-[11px] text-slate-400">
                Current: {task.currentDate}
              </span>
            </div>

            {showReschedule && (
              <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Target Buffer Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    min="2026-09-22"
                    max="2026-12-31"
                    onChange={(e) => handleValidateTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {rescheduleMessage && (
                  <div
                    className={`text-xs p-2.5 rounded-xl border flex items-start space-x-2 ${
                      rescheduleMessage.allowed
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{rescheduleMessage.text}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReschedule(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    disabled={!rescheduleMessage?.allowed}
                    onClick={handleExecuteReschedule}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      rescheduleMessage?.allowed
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer CTAs */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 shrink-0 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              onStartTimer(task);
              onClose();
            }}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-all min-h-[46px]"
          >
            <Play size={16} fill="currentColor" />
            <span className="text-xs sm:text-sm">Start Focus Timer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleComplete(task.id);
              onClose();
            }}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold transition-all min-h-[46px] border ${
              isCompleted
                ? 'bg-slate-100 text-slate-500 border-slate-200'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'
            }`}
          >
            <CheckCircle2 size={16} className={isCompleted ? 'text-slate-400' : 'text-blue-600'} />
            <span className="text-xs sm:text-sm">
              {isCompleted ? 'Mark Pending' : 'Mark Complete'}
            </span>
          </button>
        </div>

        {/* AI Analogy Sheet Sub-modal */}
        {showAnalogySheet && (
          <AIAnalogySheet
            isOpen={showAnalogySheet}
            onClose={() => setShowAnalogySheet(false)}
            initialConcept={task.topic || task.title}
            taskId={task.id}
            onAppendToNotes={(content) => handleSaveNote(taskNoteContent + content)}
          />
        )}

        {/* AI Diagnostic Modal Sub-modal */}
        {showDiagnosticModal && (
          <AIDiagnosticModal
            isOpen={showDiagnosticModal}
            onClose={() => setShowDiagnosticModal(false)}
            initialTopic={task.topic || task.title}
            taskId={task.id}
          />
        )}
      </div>
    </div>
  );
};
