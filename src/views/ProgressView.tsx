import React, { useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  BarChart3, 
  CalendarCheck, 
  Layers, 
  Target
} from 'lucide-react';

import { useProgressStore } from '../stores/useProgressStore';
import { useTaskStore } from '../stores/useTaskStore';
import { getTodayDateString } from '../engines';
import { WeeklyMinutesChart } from '../components/progress/WeeklyMinutesChart';
import { CalendarHeatmap } from '../components/progress/CalendarHeatmap';

export const ProgressView: React.FC = () => {
  const { metrics, refreshProgress } = useProgressStore();
  const { currentDate } = useTaskStore();

  const activeDate = currentDate || getTodayDateString();

  useEffect(() => {
    refreshProgress(activeDate);
  }, [activeDate, refreshProgress]);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 pb-28 space-y-5 animate-in fade-in">
      {/* Title & Quick Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Progress Analytics</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                90 Days AI
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              6 Phases • 5.5 hours/day pace • Safe holiday pacing
            </p>
          </div>

          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <BarChart3 size={18} />
          </div>
        </div>

        {/* 4 High-Impact KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Overall Completion */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-xs">
            <div className="flex items-center space-x-1 text-blue-600 font-semibold text-[10px] uppercase">
              <Target size={13} />
              <span>Overall Progress</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {metrics.overallPercentage}%
            </div>
            <span className="text-[11px] text-slate-500 block leading-tight font-medium">
              {metrics.completedStudyDaysCount} / 90 Study Days
            </span>
          </div>

          {/* Card 2: Current Streak */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-xs">
            <div className="flex items-center space-x-1 text-amber-600 font-semibold text-[10px] uppercase">
              <Flame size={13} className="fill-amber-500 text-amber-500" />
              <span>Current Streak</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {metrics.currentStreak} <span className="text-xs text-slate-400 font-normal">days</span>
            </div>
            <span className="text-[11px] text-emerald-600 block leading-tight font-medium">
              Holidays Protected
            </span>
          </div>

          {/* Card 3: Hours Studied */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-xs">
            <div className="flex items-center space-x-1 text-indigo-600 font-semibold text-[10px] uppercase">
              <Clock size={13} />
              <span>Hours Studied</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {metrics.totalHoursStudied} <span className="text-xs text-slate-400 font-normal">hrs</span>
            </div>
            <span className="text-[11px] text-slate-500 block leading-tight font-medium">
              5.5h / study day
            </span>
          </div>

          {/* Card 4: Projected Finish */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-xs">
            <div className="flex items-center space-x-1 text-emerald-600 font-semibold text-[10px] uppercase">
              <CalendarCheck size={13} />
              <span>Projected Finish</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-mono">
              20 Jan 2027
            </div>
            <span className="text-[11px] text-slate-500 block leading-tight font-medium">
              2 festival rest days accounted
            </span>
          </div>
        </div>
      </div>

      {/* 6 Phases Progress Breakdown Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers size={16} className="text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              6-Phase Curriculum Status
            </h2>
          </div>
          <span className="text-[11px] font-bold text-blue-600">
            {metrics.completedStudyDaysCount} / 90 Days Done
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          {metrics.phaseProgress.map((phase) => (
            <div key={phase.phaseId} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 truncate max-w-[240px]">
                  P{phase.phaseId}: {phase.phaseName}
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {phase.completedDays} / 15 ({phase.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${phase.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Focused Minutes Bar Chart */}
      <WeeklyMinutesChart currentDate={activeDate} />

      {/* Consistency Calendar Heatmap */}
      <CalendarHeatmap />
    </div>
  );
};
