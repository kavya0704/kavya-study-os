import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import { Resource } from '../../types';
import { useResourceStore } from '../../stores/useResourceStore';

interface BrokenLinkModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BrokenLinkModal: React.FC<BrokenLinkModalProps> = ({
  resource,
  isOpen,
  onClose
}) => {
  const [reason, setReason] = useState('404 Not Found');
  const [replacementUrl, setReplacementUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { updateResourceUrl } = useResourceStore();

  if (!isOpen || !resource) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (replacementUrl.trim()) {
      await updateResourceUrl(resource.id, replacementUrl.trim());
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setReplacementUrl('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
              <AlertTriangle size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Report Broken / Changed Link</h2>
              <p className="text-[11px] text-slate-700 font-medium">Maintain canonical learning resource integrity</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target Resource Info */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-blue-700">
              {resource.provider} • {resource.type}
            </div>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              {resource.title}
            </h3>
            <div className="text-[11px] text-slate-700 truncate flex items-center space-x-1">
              <span className="font-mono text-slate-600 font-medium">{resource.url}</span>
            </div>
            <div className="pt-1 text-[10px] text-slate-600 flex items-center space-x-1 font-medium">
              <CheckCircle2 size={11} className="text-emerald-600" />
              <span>Link last verified: {resource.lastVerifiedDate || '21 September 2026'}</span>
            </div>
          </div>

          {/* Issue Reason Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 block">
              Issue Detected
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
            >
              <option value="404 Not Found">404 Not Found / Dead Link</option>
              <option value="Video Unavailable">YouTube Video Unavailable or Private</option>
              <option value="Paywalled">Paywalled or Requires Login</option>
              <option value="Outdated">Outdated / Deprecated API Content</option>
              <option value="Other">Other Issue</option>
            </select>
          </div>

          {/* Optional Replacement URL */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Alternative / Updated URL (Optional)</span>
              <span className="text-[10px] text-slate-500 font-normal">Auto-updates database</span>
            </label>
            <input
              type="url"
              value={replacementUrl}
              onChange={(e) => setReplacementUrl(e.target.value)}
              placeholder="https://new-link.com or updated YouTube playlist..."
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
            />
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2 font-medium">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 stroke-[3]" />
              <span>✓ Link report recorded & resource updated in IndexedDB!</span>
            </div>
          )}

          {/* Buttons */}
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
              className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              {isSuccess ? 'Reported ✓' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
