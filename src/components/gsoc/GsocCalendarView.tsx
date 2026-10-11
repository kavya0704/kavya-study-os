import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Coffee, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useGsocStore } from '../../stores/useGsocStore';
import { GSOC_WEEKS } from '../../data/gsoc2027';
import { kolkataToday } from '../../engines/gsocDateUtils';
import { previewCatchUpPlan } from '../../engines/gsocReschedule';

interface GsocCalendarViewProps {
  onSelectDay?: (dayId: string) => void;
  onOpenDayModal?: (dayId: string) => void;
}

export const GsocCalendarView: React.FC<GsocCalendarViewProps> = ({ 
  onSelectDay, 
  onOpenDayModal 
}) => {
  const { 
    days, 
    progressMap, 
    activeDayId, 
    setActiveDayId, 
    settings,
    applyCatchUpOverrides 
  } = useGsocStore();

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleApplied, setRescheduleApplied] = useState(false);

  const todayStr = kolkataToday();
  const completedDayIds = new Set(
    Object.keys(progressMap).filter(id => {
      const p = progressMap[id];
      const d = days.find(day => day.id === id);
      return p && d && p.completedStepIds.length === d.steps.length && d.steps.length > 0;
    })
  );

  const catchUpPlan = previewCatchUpPlan(days, completedDayIds, settings, todayStr);

  const handleApplyReschedule = async () => {
    const overrides: Record<string, string> = {};
    for (const item of catchUpPlan.items) {
      overrides[item.dayId] = item.proposedDate;
    }
    await applyCatchUpOverrides(overrides);
    setRescheduleApplied(true);
    setTimeout(() => {
      setShowRescheduleModal(false);
      setRescheduleApplied(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-12 text-slate-900">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 flex items-center space-x-1.5">
            <Sparkles size={14} />
            <span>32-Week Civil Schedule (Asia/Kolkata)</span>
          </span>

          {catchUpPlan.items.length > 0 && (
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <RotateCcw size={13} />
              <span>Catch-Up Assistant ({catchUpPlan.items.length})</span>
            </button>
          )}
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          GSoC 2027 Calendar Matrix
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Comprehensive 223-day timeline from 21 October 2026 to 31 May 2027. Each week contains 7 structured targets (6 in Week 32) balanced with study sessions, coding tasks, and rest days.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-emerald-500" />
            <span className="text-slate-600 font-semibold">Completed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-teal-500 ring-2 ring-teal-300" />
            <span className="text-slate-600 font-semibold">Active / Selected</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-300" />
            <span className="text-slate-600 font-semibold">Upcoming Target</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-amber-100 border border-amber-300" />
            <span className="text-slate-600 font-semibold">Scheduled Rest</span>
          </div>
        </div>
      </div>

      {/* 2. 32-Week Grid */}
      <div className="space-y-3">
        {GSOC_WEEKS.map((week) => {
          const weekDays = days.filter(d => d.weekNumber === week.number);

          return (
            <div
              key={week.number}
              className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3"
            >
              {/* Week Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    Week {week.number}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                    {week.theme}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {week.dateRangeText}
                </span>
              </div>

              {/* Days Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const prog = progressMap[day.id];
                  const isDone = prog && prog.completedStepIds.length === day.steps.length && day.steps.length > 0;
                  const isActive = activeDayId === day.id;
                  const isToday = day.targetDate === todayStr;
                  const isRest = day.type === 'rest' || day.type === 'buffer';

                  return (
                    <button
                      key={day.id}
                      onClick={() => {
                        setActiveDayId(day.id);
                        onSelectDay?.(day.id);
                        onOpenDayModal?.(day.id);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5 min-h-[72px] ${
                        isActive
                          ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/30'
                          : isDone
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : isRest
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] font-black uppercase ${isDone ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {day.id.split('-')[2]?.toUpperCase()}
                        </span>

                        {isDone ? (
                          <CheckCircle2 size={13} className="text-emerald-600" />
                        ) : isRest ? (
                          <Coffee size={12} className="text-amber-600" />
                        ) : isToday ? (
                          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        ) : null}
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-slate-900 block truncate">
                          {day.targetDate.slice(5)}
                        </span>
                        <p className="text-[10px] text-slate-500 line-clamp-1 leading-tight font-medium">
                          {day.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Catch-Up Assistant Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-slate-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <RotateCcw size={18} className="text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  Catch-Up Schedule Preview
                </h3>
              </div>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              You have <strong>{catchUpPlan.items.length} overdue incomplete days</strong> before today ({todayStr}). Rebalancing will push remaining unfinished targets starting from today without altering any previously completed days.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-2xl p-3 bg-slate-50">
              {catchUpPlan.items.map((item) => (
                <div key={item.dayId} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-800 block truncate">{item.title}</span>
                    <span className="text-[10px] text-slate-400">Orig: {item.originalDate}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0 text-teal-700 font-bold">
                    <ArrowRight size={12} />
                    <span>{item.proposedDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyReschedule}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
              >
                {rescheduleApplied ? (
                  <>
                    <Check size={14} />
                    <span>Applied!</span>
                  </>
                ) : (
                  <span>Apply Catch-Up Schedule</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
