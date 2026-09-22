import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Sparkles, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import phasesSeed from '../../data/seeds/phases.json';
import { RoadmapPhase } from '../../types';

interface PhaseRoadmapViewProps {
  selectedDate?: string;
  onSelectDate: (date: string) => void;
}

export const PhaseRoadmapView: React.FC<PhaseRoadmapViewProps> = ({
  onSelectDate
}) => {
  const phases = phasesSeed as unknown as RoadmapPhase[];
  const [expandedPhaseId, setExpandedPhaseId] = useState<number | null>(1);

  const toggleExpand = (id: number) => {
    setExpandedPhaseId(expandedPhaseId === id ? null : id);
  };

  const getPhaseBadge = (phase: RoadmapPhase) => {
    if (phase.id === 3) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center space-x-1">
          <Sparkles size={10} />
          <span>Rest Break</span>
        </span>
      );
    }
    if (phase.id === 1) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          Current Active
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
        Upcoming
      </span>
    );
  };

  return (
    <div className="space-y-3.5 animate-in fade-in">
      {/* Roadmap Overview Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center space-x-1.5">
            <BookOpen size={14} />
            <span>Master 8-Phase Curriculum</span>
          </span>
          <span className="text-xs font-bold text-slate-700">
            22 Sep – 31 Dec 2026
          </span>
        </div>
        <h2 className="text-base font-black text-slate-900">101-Day AI/ML Internship Journey</h2>
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          From Python memory layout & Pandas wrangling to Production Scikit-Learn pipelines, Deep Learning, and end-to-end deployed portfolio capstones.
        </p>
      </div>

      {/* 8 Phases List */}
      <div className="space-y-2.5">
        {phases.map((phase) => {
          const isExpanded = expandedPhaseId === phase.id;

          return (
            <div
              key={phase.id}
              className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                phase.id === 1
                  ? 'bg-white border-blue-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header Accordion Trigger */}
              <div
                onClick={() => toggleExpand(phase.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    phase.id === 3
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : phase.id === 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}>
                    {phase.id}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-black text-slate-900 truncate">
                        {phase.title}
                      </h3>
                      {getPhaseBadge(phase)}
                    </div>
                    <p className="text-xs font-bold text-slate-600 mt-0.5 truncate">
                      {phase.startDate} → {phase.endDate}
                    </p>
                  </div>
                </div>

                <div className="text-slate-600 ml-2 shrink-0">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 space-y-3 bg-slate-50/50 animate-in fade-in">
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {phase.description}
                  </p>

                  {/* Exit Criteria / Proof */}
                  {phase.exitEvidence && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-blue-700">
                        <Award size={14} />
                        <span>Phase Exit Proof:</span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {phase.exitEvidence}
                      </p>
                    </div>
                  )}

                  {/* Jump to Start Date Button */}
                  <button
                    type="button"
                    onClick={() => onSelectDate(phase.startDate)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors active:scale-98"
                  >
                    <span>Inspect Week of {phase.startDate}</span>
                    <ArrowRight size={13} className="text-blue-600" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
