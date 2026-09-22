import React, { useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  BarChart3, 
  Sparkles 
} from 'lucide-react';
import { useProgressStore } from '../stores/useProgressStore';
import { useTaskStore } from '../stores/useTaskStore';
import { 
  WeeklyMinutesChart, 
  CalendarHeatmap, 
  BacklogCounterCard, 
  ReadinessScorecard 
} from '../components/progress';

export const ProgressView: React.FC = () => {
  const { metrics, refreshProgress } = useProgressStore();
  const { currentDate } = useTaskStore();

  useEffect(() => {
    refreshProgress(currentDate || '2026-09-22');
  }, [currentDate, refreshProgress]);

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-28 space-y-3.5 animate-in fade-in">
      {/* Title & Quick Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Progress Analytics</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                101 Days
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Zero-guilt velocity, backlog clearance & scorecard
            </p>
          </div>

          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <BarChart3 size={18} />
          </div>
        </div>

        {/* 3 High-Impact KPI Cards */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
            <div className="flex items-center space-x-1 text-amber-600 font-semibold text-[10px] uppercase">
              <Flame size={12} className="fill-amber-500 text-amber-500" />
              <span>Streak</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              1 <span className="text-xs text-slate-400 font-normal">day</span>
            </div>
            <span className="text-[10px] text-slate-400 block leading-tight">
              Puja Rest Safe
            </span>
          </div>

          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
            <div className="flex items-center space-x-1 text-blue-600 font-semibold text-[10px] uppercase">
              <Clock size={12} />
              <span>Focus Vol</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {metrics.focusedHoursThisWeek} <span className="text-xs text-slate-400 font-normal">hrs</span>
            </div>
            <span className="text-[10px] text-slate-400 block leading-tight">
              {metrics.focusedMinutesToday}m logged today
            </span>
          </div>

          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
            <div className="flex items-center space-x-1 text-purple-600 font-semibold text-[10px] uppercase">
              <Sparkles size={12} />
              <span>Backlog</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {metrics.backlogCompletedCount} <span className="text-xs text-slate-400 font-normal">/ 25</span>
            </div>
            <span className="text-[10px] text-blue-600 block leading-tight font-semibold">
              1 Video / Day Rule
            </span>
          </div>
        </div>
      </div>

      {/* 1. Masai Backlog 25-Video Clearance Card */}
      <BacklogCounterCard />

      {/* 2. 7-Day Focused Minutes Bar Chart */}
      <WeeklyMinutesChart currentDate={currentDate} />

      {/* 3. Consistency Calendar Heatmap */}
      <CalendarHeatmap />

      {/* 4. Interactive 31 December Readiness Scorecard */}
      <ReadinessScorecard />
    </div>
  );
};
