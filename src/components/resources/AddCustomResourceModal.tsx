import React, { useState } from 'react';
import { X, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { useResourceStore } from '../../stores/useResourceStore';

interface AddCustomResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomResourceModal: React.FC<AddCustomResourceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'video' | 'documentation' | 'practice' | 'career' | 'tool'>('documentation');
  const [provider, setProvider] = useState('');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'Hindi' | 'Hinglish' | 'English'>('English');
  const [isSuccess, setIsSuccess] = useState(false);

  const { addCustomResource } = useResourceStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    await addCustomResource({
      title: title.trim(),
      url: url.trim(),
      type,
      category: topic.trim() || 'General',
      topic: topic.trim() || 'AI/ML Resource',
      language,
      provider: provider.trim() || 'Web Link'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setUrl('');
      setProvider('');
      setTopic('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <BookmarkPlus size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add Custom Bookmark</h2>
              <p className="text-[11px] text-slate-700 font-medium">Save tutorials, repositories & docs to your library</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PyTorch Tensor Autograd Internals Guide"
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
              URL Link *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
                Category / Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
              >
                <option value="documentation">Documentation / Notes</option>
                <option value="video">Video Lecture</option>
                <option value="practice">Coding Practice</option>
                <option value="career">Career / Job Link</option>
                <option value="tool">Interactive Tool</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
              >
                <option value="English">English</option>
                <option value="Hinglish">Hinglish</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
                Provider / Creator
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. GitHub / Substack"
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1 block">
                Topic / Keyword
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. PyTorch, NLP"
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
              />
            </div>
          </div>

          {isSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2 font-medium">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 stroke-[3]" />
              <span>✓ Bookmark saved to your library!</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              {isSuccess ? 'Saved ✓' : 'Save Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
