import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  AlertCircle, 
  RotateCcw, 
  Target 
} from 'lucide-react';
import { useNoteStore } from '../../stores/useNoteStore';

interface ReflectionDrawerProps {
  currentDateStr: string;
}

export const ReflectionDrawer: React.FC<ReflectionDrawerProps> = ({
  currentDateStr
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [understood, setUnderstood] = useState('');
  const [stuck, setStuck] = useState('');
  const [revise, setRevise] = useState('');
  const [tomorrowPriority, setTomorrowPriority] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { loadReflectionForDate, saveReflection } = useNoteStore();

  // Load reflection on date change
  useEffect(() => {
    async function load() {
      const note = await loadReflectionForDate(currentDateStr);
      if (note && note.bodyMarkdown) {
        // Parse the 4 sections
        const text = note.bodyMarkdown;
        const uMatch = text.match(/### 1\. What did I understand\?\s*([\s\S]*?)(?=### 2\.|$)/);
        const sMatch = text.match(/### 2\. Where did I get stuck\?\s*([\s\S]*?)(?=### 3\.|$)/);
        const rMatch = text.match(/### 3\. What should I revise\?\s*([\s\S]*?)(?=### 4\.|$)/);
        const tMatch = text.match(/### 4\. What is tomorrow's #1 priority\?\s*([\s\S]*?)$/);

        setUnderstood(uMatch ? uMatch[1].trim() : '');
        setStuck(sMatch ? sMatch[1].trim() : '');
        setRevise(rMatch ? rMatch[1].trim() : '');
        setTomorrowPriority(tMatch ? tMatch[1].trim() : '');
        setIsSaved(true);
      } else {
        setUnderstood('');
        setStuck('');
        setRevise('');
        setTomorrowPriority('');
        setIsSaved(false);
      }
    }
    load();
  }, [currentDateStr, loadReflectionForDate]);

  const handleSave = async () => {
    if (!understood.trim() && !stuck.trim() && !revise.trim() && !tomorrowPriority.trim()) return;

    await saveReflection(currentDateStr, {
      understood: understood.trim(),
      stuck: stuck.trim(),
      revise: revise.trim(),
      tomorrowPriority: tomorrowPriority.trim()
    });

    setIsSaved(true);
  };

  const answeredCount = [understood, stuck, revise, tomorrowPriority].filter(s => s.trim().length > 0).length;

  return (
    <div className="border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-sm transition-all">
      {/* Drawer Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Compass size={17} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Daily 4-Prompt Reflection</span>
              {answeredCount === 4 ? (
                <span className="inline-flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} className="mr-1" /> Done
                </span>
              ) : answeredCount > 0 ? (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {answeredCount}/4 Answered
                </span>
              ) : null}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              Anchor key learnings, debugging takeaways, and tomorrow's priority
            </p>
          </div>
        </div>

        <div className="text-slate-400 shrink-0 ml-2">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded 4 Prompts Body */}
      {isOpen && (
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in slide-in-from-top-2">
          {/* Prompt 1 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Sparkles size={13} className="text-blue-600" />
              <span>1. What did I understand today? (1 Core Concept)</span>
            </label>
            <textarea
              rows={2}
              value={understood}
              onChange={(e) => {
                setUnderstood(e.target.value);
                setIsSaved(false);
              }}
              placeholder="e.g. Understood vector broadcasting rules and how slicing behaves..."
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none shadow-xs"
            />
          </div>

          {/* Prompt 2 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <AlertCircle size={13} className="text-amber-500" />
              <span>2. Where did I get stuck? (1 Blocker or Bug)</span>
            </label>
            <textarea
              rows={2}
              value={stuck}
              onChange={(e) => {
                setStuck(e.target.value);
                setIsSaved(false);
              }}
              placeholder="e.g. Struggled with dimension mismatch in matrix multiplication..."
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none shadow-xs"
            />
          </div>

          {/* Prompt 3 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <RotateCcw size={13} className="text-purple-500" />
              <span>3. What should I revise in 48 hours?</span>
            </label>
            <textarea
              rows={2}
              value={revise}
              onChange={(e) => {
                setRevise(e.target.value);
                setIsSaved(false);
              }}
              placeholder="e.g. In-place vs copy operations in NumPy..."
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none shadow-xs"
            />
          </div>

          {/* Prompt 4 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Target size={13} className="text-rose-500" />
              <span>4. What is tomorrow's #1 non-negotiable priority?</span>
            </label>
            <textarea
              rows={2}
              value={tomorrowPriority}
              onChange={(e) => {
                setTomorrowPriority(e.target.value);
                setIsSaved(false);
              }}
              placeholder="e.g. Complete Masai live sync before starting Python practice..."
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none shadow-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              {isSaved ? '✓ Saved to daily logs' : 'Unsaved changes'}
            </span>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95"
            >
              Save Daily Reflection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
