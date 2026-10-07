import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';
import { PHASES, DAYS } from '../../data/roadmap';
import { useProgressStore } from '../../stores/useProgressStore';
import { getLocalCalendarDate } from '../../engines/dateUtils';

interface PhaseRoadmapViewProps {
  selectedDate?: string;
  onSelectDate: (date: string) => void;
}

export const PhaseRoadmapView: React.FC<PhaseRoadmapViewProps> = ({
  selectedDate,
  onSelectDate
}) => {
  const { metrics } = useProgressStore();
  const todayDate = getLocalCalendarDate();
  const currentActiveDate = selectedDate || todayDate;

  // Determine which phase is currently active based on currentActiveDate
  const currentActiveDay = DAYS.find(d => d.date === currentActiveDate);
  const activePhaseId = currentActiveDay?.phaseId || 1;

  const [expandedPhaseId, setExpandedPhaseId] = useState<number | null>(activePhaseId);

  const toggleExpand = (id: number) => {
    setExpandedPhaseId(expandedPhaseId === id ? null : id);
  };

  return (
    <div className="space-y-3.5 animate-in fade-in pb-10">
      {/* Roadmap Overview Banner */}
      <div className="bg-[#121e26] border border-slate-800 p-4 rounded-3xl space-y-1.5 shadow-sm text-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center space-x-1.5">
            <BookOpen size={14} />
            <span>90-Day AI Engineer Curriculum</span>
          </span>
          <span className="text-xs font-bold text-slate-400">
            6 Phases • 5.5h/day
          </span>
        </div>
        <h2 className="text-base font-black text-white">
          Full 90-Study-Day Roadmap
        </h2>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          From Python systems & ML foundations to Production LLM RAG, Autonomous Multi-Agents, Evals, and Cloud Deployments.
        </p>

        {/* Global Progress Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
            <span>Overall Progress</span>
            <span className="text-cyan-400 font-black">{metrics.completedStudyDaysCount} / 90 Days ({metrics.overallPercentage}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${metrics.overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Phases Cards List */}
      <div className="space-y-3">
        {PHASES.map((phase) => {
          const isExpanded = expandedPhaseId === phase.id;
          const isCurrentPhase = phase.id === activePhaseId;
          const phaseMetric = metrics.phaseProgress.find(p => p.phaseId === phase.id);
          const phaseDays = DAYS.filter(d => d.phaseId === phase.id);

          return (
            <div
              key={phase.id}
              className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                isCurrentPhase
                  ? 'bg-[#121e26] border-cyan-500/60 shadow-lg'
                  : 'bg-[#121e26] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header Accordion Trigger */}
              <div
                onClick={() => toggleExpand(phase.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isCurrentPhase
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    P{phase.id}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-black text-white truncate">
                        {phase.name}
                      </h3>
                      {isCurrentPhase && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800 shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 pr-2">
                      <span>Days {phase.startDay}–{phase.endDay}</span>
                      <span className="font-semibold text-cyan-400">
                        {phaseMetric?.completedDays || 0}/15 ({phaseMetric?.percentage || 0}%)
                      </span>
                    </div>

                    {/* Mini phase bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden pr-2">
                      <div 
                        className="h-full bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${phaseMetric?.percentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 ml-2 shrink-0">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-800/80 space-y-3 bg-[#0d161d] animate-in fade-in">
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    <strong className="text-slate-200">Outcome:</strong> {phase.outcome}
                  </p>

                  {/* Day-by-Day List */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Days in Phase ({phaseDays.length} total)
                    </div>

                    <div className="space-y-1.5 max-h-96 overflow-y-auto pr-0.5">
                      {phaseDays.map((d) => {
                        const isToday = d.date === todayDate;
                        const isSelected = d.date === currentActiveDate;

                        if (d.isHoliday) {
                          return (
                            <div
                              key={d.date}
                              onClick={() => onSelectDate(d.date)}
                              className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-center justify-between cursor-pointer hover:bg-amber-950/40 text-xs text-amber-300"
                            >
                              <div className="flex items-center space-x-2">
                                <Sparkles size={14} className="text-amber-400 shrink-0" />
                                <div>
                                  <span className="font-bold">{d.holidayName}</span>
                                  <span className="text-[10px] text-amber-400/80 block">{d.date} • Protected Rest</span>
                                </div>
                              </div>
                              <span className="text-[10px] uppercase font-bold text-amber-400">Rest</span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={d.date}
                            onClick={() => onSelectDate(d.date)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-cyan-950/40 border-cyan-500 text-white'
                                : isToday
                                ? 'bg-blue-950/30 border-blue-600 text-white'
                                : 'bg-[#121e26] border-slate-800/80 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-black uppercase tracking-wider ${
                                  isToday ? 'text-cyan-400' : 'text-slate-400'
                                }`}>
                                  Day {d.day} • {d.date}
                                </span>
                                {d.isBuildDay && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                                    Build
                                  </span>
                                )}
                                {isToday && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-600 text-white">
                                    Today
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-semibold text-white truncate mt-0.5">
                                {d.topics.join(' • ')}
                              </h4>
                            </div>

                            <ArrowRight size={13} className="text-slate-500 shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
