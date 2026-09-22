import React, { useState } from 'react';
import { Sparkles, Loader2, Check, Copy } from 'lucide-react';
import { generateRecallQuestions } from '../../services/ai';

interface AIRecallButtonProps {
  topic: string;
  contextNotes?: string;
  onQuestionsGenerated?: (questionsMarkdown: string) => void;
  className?: string;
}

export const AIRecallButton: React.FC<AIRecallButtonProps> = ({
  topic,
  contextNotes,
  onQuestionsGenerated,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic && !contextNotes) return;
    setLoading(true);
    setError(null);
    try {
      const questions = await generateRecallQuestions(topic || 'AI/ML Study Topic', contextNotes);
      setGeneratedMarkdown(questions);
      if (onQuestionsGenerated) {
        onQuestionsGenerated(questions);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate recall questions.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedMarkdown) return;
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            loading
              ? 'bg-purple-100 text-purple-900 border border-purple-200 cursor-wait'
              : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
          } ${className}`}
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin text-purple-600" />
              <span>Generating Recall...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} className="text-purple-600" />
              <span>Generate 5 Recall Questions</span>
            </>
          )}
        </button>

        {generatedMarkdown && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors"
            title="Copy questions to clipboard"
          >
            {copied ? <Check size={13} className="text-emerald-600 stroke-[3]" /> : <Copy size={13} />}
          </button>
        )}
      </div>

      {error && (
        <div className="text-[11px] text-red-900 bg-red-50 border border-red-200 p-2 rounded-xl font-medium">
          {error}
        </div>
      )}
    </div>
  );
};
