import React, { useEffect, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onUndo,
  onDismiss,
  durationMs = 5000
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);
      if (elapsed >= durationMs) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onDismiss]);

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md bg-surface-2/95 backdrop-blur-md border border-slate-700/80 shadow-2xl shadow-black/60 rounded-2xl p-3.5 overflow-hidden transform transition-all duration-200 animate-in slide-in-from-bottom-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 shadow-[0_0_8px_#14b8a6]" />
            <p className="text-sm font-medium text-slate-100 truncate">{message}</p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onUndo && (
              <button
                type="button"
                onClick={onUndo}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 active:bg-teal-500/40 rounded-lg text-xs font-semibold tracking-wide border border-teal-500/30 transition-colors"
              >
                <RotateCcw size={13} className="shrink-0" />
                <span>Undo</span>
              </button>
            )}
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss toast"
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
