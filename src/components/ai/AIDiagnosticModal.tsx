import React, { useState } from 'react';
import { 
  X, 
  Bug, 
  Sparkles, 
  Loader2, 
  Check, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Code2 
} from 'lucide-react';
import { diagnoseError, ParsedDiagnostic } from '../../services/ai';
import { useNoteStore } from '../../stores/useNoteStore';

interface AIDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialError?: string;
  taskId?: string;
}

export const AIDiagnosticModal: React.FC<AIDiagnosticModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
  initialError = '',
  taskId
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [errorTrace, setErrorTrace] = useState(initialError);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<ParsedDiagnostic | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const { logError } = useNoteStore();

  if (!isOpen) return null;

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorTrace.trim()) return;

    setLoading(true);
    setApiError(null);
    setDiagnostic(null);
    setSavedSuccess(false);

    try {
      const result = await diagnoseError(errorTrace.trim(), codeSnippet.trim() || undefined, topic.trim() || undefined);
      setDiagnostic(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Diagnosis failed. Please check internet connection.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToErrorLog = async () => {
    if (!diagnostic) return;
    await logError({
      taskId: taskId || 'general-debug',
      symptom: diagnostic.symptom,
      rootCause: diagnostic.rootCause,
      codeFix: diagnostic.codeFix,
      lesson: diagnostic.interviewLesson,
      topic: topic || 'General Debug'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyCode = () => {
    if (!diagnostic?.codeFix) return;
    navigator.clipboard.writeText(diagnostic.codeFix);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
              <Bug size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <span>AI Error Diagnostic Lab</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  LLaMA 3.3 70B
                </span>
              </h2>
              <p className="text-[11px] text-slate-700 font-medium">Zero-guilt root cause analysis & interview lessons</p>
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

        {/* Scroll Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <form onSubmit={handleDiagnose} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
                Topic or Module (Optional)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. NumPy Broadcasting, Gradient Descent, PyTorch Tensors"
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center justify-between">
                <span>Traceback or Bug Description *</span>
                <span className="text-[10px] text-slate-500 font-normal">Paste error logs</span>
              </label>
              <textarea
                required
                rows={3}
                value={errorTrace}
                onChange={(e) => setErrorTrace(e.target.value)}
                placeholder="Paste the traceback, exception message, or bug symptom here..."
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-600 resize-none shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center justify-between">
                <span>Failing Code Snippet (Optional)</span>
                <span className="text-[10px] text-slate-500 font-normal">Python / SQL</span>
              </label>
              <textarea
                rows={3}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="def compute_loss(y, y_hat):&#10;    return np.mean((y - y_hat)**2)"
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-600 resize-none shadow-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm ${
                loading
                  ? 'bg-blue-100 text-blue-800 border border-blue-200 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Diagnosing via Groq LPU™...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Diagnose Error & Root Cause</span>
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

          {/* Diagnostic Results Breakdown */}
          {diagnostic && (
            <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2">
              {/* Symptom */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 flex items-center space-x-1">
                  <AlertTriangle size={12} />
                  <span>Symptom</span>
                </span>
                <p className="text-xs text-red-950 leading-relaxed font-medium">
                  {diagnostic.symptom}
                </p>
              </div>

              {/* Root Cause */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1">
                  <Lightbulb size={12} />
                  <span>Root Cause</span>
                </span>
                <p className="text-xs text-slate-900 leading-relaxed font-medium">
                  {diagnostic.rootCause}
                </p>
              </div>

              {/* Code Fix */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center space-x-1">
                    <Code2 size={12} />
                    <span>Working Code Fix</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 flex items-center space-x-1 text-[10px] font-semibold"
                  >
                    {copiedCode ? <Check size={11} className="text-emerald-600 stroke-[3]" /> : <Copy size={11} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {diagnostic.codeFix}
                </pre>
              </div>

              {/* Interview Lesson */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 flex items-center space-x-1">
                  <Sparkles size={12} />
                  <span>Interview Defense Lesson</span>
                </span>
                <p className="text-xs text-slate-900 leading-relaxed font-medium">
                  {diagnostic.interviewLesson}
                </p>
              </div>

              {/* Action: Save to #error_log */}
              <button
                type="button"
                onClick={handleSaveToErrorLog}
                disabled={savedSuccess}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors ${
                  savedSuccess
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-900 hover:bg-black text-white'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-600 stroke-[3]" />
                    <span>Logged to Permanent #error_log!</span>
                  </>
                ) : (
                  <>
                    <Bug size={14} className="text-red-400" />
                    <span>Save to #error_log in Notes</span>
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
