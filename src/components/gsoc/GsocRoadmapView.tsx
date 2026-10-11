import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Coffee, 
  Filter, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useGsocStore } from '../../stores/useGsocStore';
import { GSOC_PHASES } from '../../data/gsoc2027';

interface GsocRoadmapViewProps {
  onOpenDayModal?: (dayId: string) => void;
  onSelectDay?: (dayId: string) => void;
}

type FilterType = 'all' | 'incomplete' | 'completed' | 'rest';

export const GsocRoadmapView: React.FC<GsocRoadmapViewProps> = ({ 
  onOpenDayModal,
  onSelectDay 
}) => {
  const { days, progressMap, activeDayId, setActiveDayId, metrics } = useGsocStore();
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>('gsoc-phase-1');
  const [filter, setFilter] = useState<FilterType>('all');

  const toggleExpand = (phaseId: string) => {
    setExpandedPhaseId(expandedPhaseId === phaseId ? null : phaseId);
  };

  const getFilteredDaysForPhase = (phaseId: string) => {
    const phaseDays = days.filter(d => d.phaseId === phaseId);
    if (filter === 'all') return phaseDays;
    if (filter === 'rest') return phaseDays.filter(d => d.type === 'rest' || d.type === 'buffer');
    if (filter === 'completed') {
      return phaseDays.filter(d => {
        const prog = progressMap[d.id];
        return prog && prog.completedStepIds.length === d.steps.length && d.steps.length > 0;
      });
    }
    if (filter === 'incomplete') {
      return phaseDays.filter(d => {
        const prog = progressMap[d.id];
        return !prog || prog.completedStepIds.length < d.steps.length;
      });
    }
    return phaseDays;
  };

  const overallPercentage = metrics.totalDays > 0 
    ? Math.round((metrics.completedDays / metrics.totalDays) * 100) 
    : 0;

  return (
    <div className="space-y-4 animate-in fade-in pb-12 text-slate-900">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 flex items-center space-x-1.5">
            <Sparkles size={14} />
            <span>32-Week Curriculum (21 Oct 2026 - 31 May 2027)</span>
          </span>
          <span className="text-xs font-bold text-slate-500">
            8 Structured Phases • 223 Target Days
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          GSoC 2027 Complete Preparation Roadmap
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Progress sequentially through tooling mastery, good-first-issues, real codebase contributions in DIPY / PyTorch-Ignite, mentor communications, and a competitive 12-section proposal.
        </p>

        {/* Global Progress */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-slate-600">Overall Progress</span>
            <span className="text-teal-600 font-black">
              {metrics.completedDays} / {metrics.totalDays} Days ({overallPercentage}% )
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Days ({days.length})
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filter === 'incomplete' 
                ? 'bg-amber-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filter === 'completed' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Completed ({metrics.completedDays})
          </button>
          <button
            onClick={() => setFilter('rest')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filter === 'rest' 
                ? 'bg-purple-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rest Days
          </button>
        </div>
      </div>

      {/* 2. Phases Accordion */}
      <div className="space-y-3">
        {GSOC_PHASES.map((phase) => {
          const isExpanded = expandedPhaseId === phase.id;
          const phaseDaysFiltered = getFilteredDaysForPhase(phase.id);
          const allPhaseDays = days.filter(d => d.phaseId === phase.id);
          
          const completedInPhase = allPhaseDays.filter(d => {
            const prog = progressMap[d.id];
            return prog && prog.completedStepIds.length === d.steps.length && d.steps.length > 0;
          }).length;
          
          const phasePercentage = allPhaseDays.length > 0 
            ? Math.round((completedInPhase / allPhaseDays.length) * 100) 
            : 0;

          return (
            <div 
              key={phase.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all"
            >
              {/* Phase Accordion Header */}
              <button
                onClick={() => toggleExpand(phase.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1.5 flex-1 pr-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      Phase {phase.phaseNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {phase.targetRangeText}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {completedInPhase} / {allPhaseDays.length} Done ({phasePercentage}%)
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {phase.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    <strong>Focus:</strong> {phase.focus}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <span className="font-semibold text-slate-700">Deliverable:</span>
                    <span className="truncate">{phase.evidenceToProduce}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 text-slate-500 shrink-0">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded Phase Days List */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-2.5">
                  {phaseDaysFiltered.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center italic">
                      No days match the active filter in this phase.
                    </p>
                  ) : (
                    phaseDaysFiltered.map((day) => {
                      const prog = progressMap[day.id];
                      const completedCount = prog?.completedStepIds.length || 0;
                      const totalSteps = day.steps.length;
                      const isComplete = totalSteps > 0 && completedCount === totalSteps;
                      const isActive = activeDayId === day.id;

                      return (
                        <div
                          key={day.id}
                          className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isActive
                              ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500/30'
                              : isComplete
                              ? 'border-emerald-200 bg-emerald-50/30'
                              : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDayId(day.id);
                                onSelectDay?.(day.id);
                              }}
                              className="mt-0.5 shrink-0 text-slate-400 hover:text-teal-600"
                            >
                              {isComplete ? (
                                <CheckCircle2 size={18} className="text-emerald-600 fill-emerald-100" />
                              ) : (
                                <Circle size={18} />
                              )}
                            </button>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                                  {day.id.toUpperCase()}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {day.targetDate}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-0.5">
                                  <Clock size={11} />
                                  <span>{day.coreMinutes}m</span>
                                </span>
                                {(day.type === 'rest' || day.type === 'buffer') && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center space-x-0.5">
                                    <Coffee size={10} />
                                    <span>Rest</span>
                                  </span>
                                )}
                              </div>

                              <h4 className={`text-xs font-black truncate ${isComplete ? 'text-slate-600 line-through' : 'text-slate-900'}`}>
                                {day.title}
                              </h4>

                              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                                <span>{completedCount}/{totalSteps} steps completed</span>
                                {prog?.evidenceUrls && prog.evidenceUrls.length > 0 && (
                                  <span className="text-teal-600 font-bold">
                                    • {prog.evidenceUrls.length} evidence
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setActiveDayId(day.id);
                                onSelectDay?.(day.id);
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => onOpenDayModal?.(day.id)}
                              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Details & Notes"
                            >
                              <ExternalLink size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
