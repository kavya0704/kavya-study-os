import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  List, 
  Heading3, 
  Check, 
  Eye, 
  Edit3, 
  FileCode
} from 'lucide-react';

interface MarkdownEditorProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  minHeight?: string;
  taskId?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue,
  onSave,
  placeholder = 'Write markdown notes, code snippets, or formulas...',
  minHeight = '200px'
}) => {
  const [content, setContent] = useState(initialValue);
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true);

  // Sync with prop when prop changes externally
  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  // Debounced auto-save (500ms)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await onSave(content);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) {
        console.error('Auto-save error:', e);
        setSaveStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [content, onSave]);

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = content.slice(0, start) + replacement + content.slice(end);
    setContent(newContent);

    // Focus and position cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 50);
  };

  // Simple, robust client-side markdown renderer for preview (zero heavy external parser bundle)
  const renderSimpleMarkdown = (md: string) => {
    if (!md.trim()) {
      return <p className="text-slate-500 italic text-xs">Nothing to preview yet.</p>;
    }

    const lines = md.split('\n');
    return (
      <div className="space-y-2 text-xs text-slate-900 leading-relaxed font-sans select-text">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-sm font-bold text-blue-700 pt-1">{line.slice(4)}</h3>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-base font-bold text-slate-900 pt-2">{line.slice(3)}</h2>;
          }
          if (line.startsWith('# ')) {
            return <h1 key={idx} className="text-lg font-bold text-slate-900 pt-2">{line.slice(2)}</h1>;
          }
          if (line.startsWith('- ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-slate-800 font-medium">
                {line.slice(2)}
              </li>
            );
          }
          if (line.startsWith('```')) {
            return <div key={idx} className="text-[11px] font-mono text-blue-700 bg-slate-50 p-1.5 rounded border border-slate-200">{line}</div>;
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx} className="text-slate-900 font-normal">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm flex flex-col">
      {/* Top Action & Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs shrink-0">
        {/* Formatting actions */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => insertSnippet('**', '**')}
            title="Bold"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('*', '*')}
            title="Italic"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('### ')}
            title="Heading"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <Heading3 size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('`', '`')}
            title="Inline Code"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <Code size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('```python\n', '\n```')}
            title="Python Code Block"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <FileCode size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('- ')}
            title="Bullet List"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <List size={14} />
          </button>
        </div>

        {/* View Toggle & Save Indicator */}
        <div className="flex items-center space-x-2">
          {/* Status */}
          <div className="text-[10px] font-bold flex items-center min-w-[50px] justify-end">
            {saveStatus === 'saving' && (
              <span className="text-amber-600 animate-pulse">Saving...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-600 flex items-center">
                <Check size={11} className="mr-0.5 stroke-[3]" /> Saved
              </span>
            )}
          </div>

          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveView('edit')}
              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center space-x-1 ${
                activeView === 'edit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 size={12} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('preview')}
              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center space-x-1 ${
                activeView === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye size={12} />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-3 flex-1 bg-white">
        {activeView === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight, fontSize: '16px' }} // Strict 16px font-size to prevent iOS Safari auto-zooming!
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none resize-y font-mono text-sm leading-relaxed p-1"
          />
        ) : (
          <div style={{ minHeight }} className="p-2 overflow-y-auto">
            {renderSimpleMarkdown(content)}
          </div>
        )}
      </div>
    </div>
  );
};
