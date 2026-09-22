import React from 'react';
import { formatSecondsToDisplay } from '../../engines/timerReconstructor';
import { FocusIntervalMode } from '../../types';
import { Sparkles, Pause, Flame } from 'lucide-react';

interface TimerDisplayProps {
  elapsedSeconds: number;
  mode: FocusIntervalMode;
  isRunning: boolean;
  isPaused: boolean;
  activeTopic: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  elapsedSeconds,
  mode,
  isRunning,
  isPaused,
  activeTopic
}) => {
  const getTargetSeconds = () => {
    if (mode === 'pomodoro_25_5') return 25 * 60;
    if (mode === 'deep_50_10') return 50 * 60;
    return 0;
  };

  const targetSeconds = getTargetSeconds();
  const isCountdown = targetSeconds > 0;
  const displaySeconds = isCountdown
    ? Math.max(0, targetSeconds - elapsedSeconds)
    : elapsedSeconds;

  const formattedTime = formatSecondsToDisplay(displaySeconds);

  const size = 260;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progressPct = isCountdown
    ? Math.min(1, elapsedSeconds / targetSeconds)
    : Math.min(1, (elapsedSeconds % 3600) / 3600);

  const strokeDashoffset = circumference - progressPct * circumference;

  const getModeLabel = () => {
    switch (mode) {
      case 'pomodoro_25_5':
        return '25/5 Pomodoro Focus';
      case 'deep_50_10':
        return '50/10 Deep Work Block';
      case 'stopwatch':
      default:
        return 'Open Stopwatch Session';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Mode & Topic Header */}
      <div className="text-center space-y-1 mb-5">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200">
          <Sparkles size={11} />
          <span>{getModeLabel()}</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 max-w-xs truncate mx-auto px-2">
          {activeTopic}
        </h2>
      </div>

      {/* Circular Ring Display */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#timerGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-out"
          />

          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <div className="text-5xl font-black font-mono tracking-wider text-slate-900 tabular-nums">
            {formattedTime}
          </div>

          <div className="mt-3 flex items-center space-x-1.5 text-xs font-bold tracking-wide">
            {isPaused ? (
              <span className="inline-flex items-center text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Pause size={11} className="mr-1" /> PAUSED
              </span>
            ) : isRunning ? (
              <span className="inline-flex items-center text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <Flame size={12} className="mr-1 fill-blue-500 text-blue-500" /> FOCUSING
              </span>
            ) : (
              <span className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                Ready to Record
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
