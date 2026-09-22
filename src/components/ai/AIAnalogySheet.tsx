import React, { useState } from 'react';
import { 
  X, 
  Lightbulb, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  FileEdit, 
  AlertTriangle 
} from 'lucide-react';
import { explainConceptAnalogy } from '../../services/ai';
import { useNoteStore } from '../../stores/useNoteStore';

interface AIAnalogySheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialConcept?: string;
  taskId?: string;
  onAppendToNotes?: (content: string) => void;
}

export const AIAnalogySheet: React.FC<AIAnalogySheetProps> = ({
  isOpen,
  onClose,
  initialConcept = '',
  taskId,
  onAppendToNotes
}) => {
  const [concept, setConcept] = useState(initialConcept);
  const [language, setLanguage] = useState<'en' | 'hinglish'>('en');
  const [loading, setLoading] = useState(false);
  const [analogyMarkdown, setAnalogyMarkdown] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedToNotes, setSavedToNotes] = useState(false);

  const { saveNote } = useNoteStore();

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;

    setLoading(true);
    setApiError(null);
    setAnalogyMarkdown(null);
    setSavedToNotes(false);

    try {
      const result = await explainConceptAnalogy(concept.trim(), language);
      setAnalogyMarkdown(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate analogy. Please check connection.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analogyMarkdown) return;
    navigator.clipboard.writeText(analogyMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToNotes = async () => {
    if (!analogyMarkdown) return;

    if (onAppendToNotes) {
      onAppendToNotes(`\n\n### Intuitive Analogy: ${concept}\n${analogyMarkdown}`);
    } else if (taskId) {
      await saveNote({
        taskId,
        title: `Analogy: ${concept}`,
        bodyMarkdown: analogyMarkdown,
        type: 'topic_note',
        tags: [concept, language]
      });
    }

    setSavedToNotes(true);
    setTimeout(() => setSavedToNotes(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Lightbulb size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <span>AI Concept Analogy</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Intuitive
                </span>
              </h2>
              <p className="text-[11px] text-slate-700 font-medium">Vivid real-world analogies & under-the-hood intuition</p>
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

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
                Concept or Algorithm to Explain *
              </label>
              <input
                type="text"
                required
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. Backpropagation, PCA Eigenvalues, ResNet Skip Connections"
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm font-medium"
              />
            </div>

            {/* Language switch */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
                Explanation Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-amber-50 text-amber-900 border border-amber-400 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  🇬🇧 English (Visual Analogy)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hinglish')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    language === 'hinglish'
                      ? 'bg-amber-50 text-amber-900 border border-amber-400 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  🇮🇳 Hinglish (CampusX Style)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm ${
                loading
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 cursor-wait'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Synthesizing Analogy...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Explain Concept Intuition</span>
                </>
              )}
            </button>
          </form>

          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start space-x-2">
              <AlertTriangle size={15} className="shrink-0 text-red-600 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {analogyMarkdown && (
            <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Lightbulb size={13} className="text-amber-500" />
                  <span>Analogy for "{concept}"</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors flex items-center space-x-1 text-xs font-semibold"
                >
                  {copied ? <Check size={12} className="text-emerald-600 stroke-[3]" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed space-y-2 whitespace-pre-wrap font-medium">
                {analogyMarkdown}
              </div>

              <button
                type="button"
                onClick={handleSaveToNotes}
                disabled={savedToNotes}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors ${
                  savedToNotes
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-900 hover:bg-black text-white'
                }`}
              >
                {savedToNotes ? (
                  <>
                    <Check size={14} className="text-emerald-600 stroke-[3]" />
                    <span>Appended to Task Notes!</span>
                  </>
                ) : (
                  <>
                    <FileEdit size={14} className="text-blue-400" />
                    <span>Save Analogy to Task Notes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
