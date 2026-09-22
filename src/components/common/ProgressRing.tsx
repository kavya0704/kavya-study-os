import React from 'react';

interface ProgressRingProps {
  completedTasks: number;
  totalTasks: number;
  focusedMinutes: number;
  plannedMinutes: number;
  isRestDay?: boolean;
  size?: number;
  strokeWidth?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  completedTasks,
  totalTasks,
  focusedMinutes,
  plannedMinutes,
  isRestDay = false,
  size = 78,
  strokeWidth = 8
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const taskPct = totalTasks > 0 ? Math.min(1, completedTasks / totalTasks) : 0;
  const taskOffset = circumference - taskPct * circumference;
  const displayPercentage = Math.round(taskPct * 100);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
      {/* Left Stat Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-900">
          Today's progress
        </h3>

        <div className="flex items-baseline">
          <span className="text-2xl font-black text-slate-900">
            {completedTasks}
          </span>
          <span className="text-sm font-semibold text-slate-700 ml-1.5">
            of {totalTasks} tasks
          </span>
        </div>

        <div className="flex items-baseline text-sm pt-0.5">
          <span className="font-bold text-slate-900">
            {focusedMinutes}m
          </span>
          <span className="text-slate-400 font-normal ml-1">
            / {plannedMinutes}m
          </span>
        </div>
      </div>

      {/* Right Progress Ring */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2563eb"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={taskOffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Percentage Label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-extrabold text-slate-900 leading-none">
            {isRestDay ? '100%' : `${displayPercentage}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
