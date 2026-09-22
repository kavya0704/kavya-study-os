import React from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { FocusIntervalMode } from '../../types';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  mode: FocusIntervalMode;
  onSetMode: (mode: FocusIntervalMode) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onDiscard: () => void;
}

export function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  } catch {
    // AudioContext fallback
  }
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  mode,
  onSetMode,
  onStart,
  onPause,
  onResume,
  onFinish,
  onDiscard
}) => {
  const modes: { id: FocusIntervalMode; label: string; desc: string }[] = [
    { id: 'stopwatch', label: 'Stopwatch', desc: 'Open count' },
    { id: 'pomodoro_25_5', label: '25/5 Pomodoro', desc: '25m focus' },
    { id: 'deep_50_10', label: '50/10 Deep Work', desc: '50m focus' },
  ];

  const handleFinish = () => {
    playChime();
    onFinish();
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 px-4">
      {/* Interval Modes Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        {modes.map((m) => {
          const isSelected = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              disabled={isRunning}
              onClick={() => onSetMode(m.id)}
              className={`py-2 px-1 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              } ${isRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="text-xs">{m.label}</div>
              <div className={`text-[10px] ${isSelected ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                {m.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5">
        {!isRunning ? (
          /* Start Button */
          <button
            type="button"
            onClick={onStart}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-sm active:scale-[0.98] transition-all min-h-[48px]"
          >
            <Play size={18} fill="currentColor" />
            <span className="text-sm tracking-wide">Start Focus Session</span>
          </button>
        ) : (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Pause / Resume */}
              {isPaused ? (
                <button
                  type="button"
                  onClick={onResume}
                  className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-sm active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPause}
                  className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <Pause size={16} />
                  <span>Pause</span>
                </button>
              )}

              {/* Finish Button */}
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl active:scale-[0.98] transition-all min-h-[44px]"
              >
                <Square size={14} fill="currentColor" />
                <span>Finish & Save</span>
              </button>
            </div>

            {/* Discard Session */}
            <button
              type="button"
              onClick={onDiscard}
              className="w-full flex items-center justify-center space-x-1.5 py-2 text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
            >
              <RotateCcw size={12} />
              <span>Discard Session</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
