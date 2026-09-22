import React, { useState } from 'react';
import { AlertTriangle, Check, Copy, Trash2, Tag, Calendar } from 'lucide-react';
import { Note } from '../../types';

interface ErrorLogCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}

export const ErrorLogCard: React.FC<ErrorLogCardProps> = ({
  note,
  onDelete
}) => {
  const [copied, setCopied] = useState(false);

  // Parse sections from markdown
  const text = note.bodyMarkdown;
  const symptomMatch = text.match(/### Symptom\s*([\s\S]*?)(?=### Root Cause|$)/);
  const rootCauseMatch = text.match(/### Root Cause\s*([\s\S]*?)(?=### (Code Fix|Solution)|$)/);
  const codeFixMatch = text.match(/```(?:python)?\s*([\s\S]*?)```/);
  const lessonMatch = text.match(/### (?:Key )?Lesson\s*([\s\S]*?)$/);

  const symptom = symptomMatch ? symptomMatch[1].trim() : note.title;
  const rootCause = rootCauseMatch ? rootCauseMatch[1].trim() : '';
  const codeFix = codeFixMatch ? codeFixMatch[1].trim() : '';
  const lesson = lessonMatch ? lessonMatch[1].trim() : '';

  const handleCopyCode = () => {
    if (!codeFix) return;
    navigator.clipboard.writeText(codeFix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="border border-red-200 bg-white rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle size={11} className="mr-1" /> Error Diagnostic
          </span>
          {note.tags.filter(t => t !== '#error_log').map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Tag size={9} className="mr-1 text-blue-600" /> {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="flex items-center text-[10px] font-medium">
            <Calendar size={10} className="mr-1" /> {formattedDate}
          </span>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              aria-label="Delete diagnostic note"
              className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Symptom */}
      <div className="space-y-0.5">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-800">Symptom</h4>
        <p className="text-xs text-red-950 font-medium leading-relaxed bg-red-50/70 p-2.5 rounded-xl border border-red-200">
          {symptom}
        </p>
      </div>

      {/* Root Cause */}
      {rootCause && (
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Root Cause</h4>
          <p className="text-xs text-slate-900 leading-relaxed font-normal">
            {rootCause}
          </p>
        </div>
      )}

      {/* Code Fix Snippet */}
      {codeFix && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Code Fix</h4>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            <code>{codeFix}</code>
          </pre>
        </div>
      )}

      {/* Interview Lesson */}
      {lesson && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl space-y-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Interview Lesson</h4>
          <p className="text-xs text-slate-900 font-medium leading-relaxed">
            {lesson}
          </p>
        </div>
      )}
    </div>
  );
};
