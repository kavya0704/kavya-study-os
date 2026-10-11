import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Play, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Clock, 
  Coffee,
  BookmarkCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useGsocStore } from '../../stores/useGsocStore';
import { useTimerStore } from '../../stores/useTimerStore';
import { daysUntilGsocStart, isBeforeGsocStart, kolkataToday } from '../../engines/gsocDateUtils';
import { GSOC_RESOURCES } from '../../data/gsoc2027';

interface GsocTodayViewProps {
  onOpenDayModal?: (dayId: string) => void;
  onNavigateToTab?: (tab: 'roadmap' | 'learn' | 'orgs' | 'contributions' | 'proposal' | 'calendar' | 'progress') => void;
}

export const GsocTodayView: React.FC<GsocTodayViewProps> = ({ 
  onOpenDayModal,
  onNavigateToTab 
}) => {
  const { 
    days, 
    activeDayId, 
    setActiveDayId, 
    progressMap, 
    toggleStepComplete,
    metrics 
  } = useGsocStore();

  const { startTimer, isRunning, activeTrackId, activeTopic } = useTimerStore();
  const [showPreKickoffDetails, setShowPreKickoffDetails] = useState(false);

  const todayStr = kolkataToday();
  const isBefore = isBeforeGsocStart(todayStr);
  const daysRemaining = daysUntilGsocStart(todayStr);

  // Find active day
  const currentDay = days.find(d => d.id === activeDayId) || days[0];
  const dayProgress = progressMap[currentDay?.id || ''] || {
    dayId: currentDay?.id || '',
    completedStepIds: [],
    completed: false,
    evidenceUrls: [],
    notes: '',
    updatedAt: ''
  };

  const currentIndex = days.findIndex(d => d.id === currentDay?.id);
  const prevDay = currentIndex > 0 ? days[currentIndex - 1] : null;
  const nextDay = currentIndex < days.length - 1 ? days[currentIndex + 1] : null;

  const currentStepResourceIds = currentDay?.steps.flatMap(s => s.resourceRefs.map(r => r.resourceId)) || [];
  const dayResources = GSOC_RESOURCES.filter(r => currentStepResourceIds.includes(r.id));
  const completedStepsCount = dayProgress.completedStepIds.length;
  const totalSteps = currentDay?.steps.length || 0;
  const isDayFullyComplete = totalSteps > 0 && completedStepsCount === totalSteps;

  const handleStartTimer = () => {
    if (!currentDay) return;
    startTimer(
      undefined,
      `GSoC: ${currentDay.title}`,
      'stopwatch',
      'gsoc2027',
      currentDay.id
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-12 text-slate-900">
      {/* 1. Pre-Kickoff Countdown Banner (Active before Oct 21, 2026) */}
      {isBefore && (
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-lg border border-indigo-700/40 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles size={13} className="text-amber-400" />
                <span>Pre-Season Preparation</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                {daysRemaining} Days to GSoC 2027 Kick-Off
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl font-medium leading-relaxed">
                Official 223-day sprint begins <strong>Wednesday, 21 October 2026</strong>. You can preview curriculum days early or tackle pre-season checklist items below.
              </p>
            </div>
            <button
              onClick={() => setShowPreKickoffDetails(!showPreKickoffDetails)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white whitespace-nowrap ml-2"
            >
              {showPreKickoffDetails ? 'Hide' : 'Checklist'}
            </button>
          </div>

          {showPreKickoffDetails && (
            <div className="mt-4 pt-4 border-t border-indigo-800/60 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-indigo-200">
                <BookmarkCheck size={14} className="text-emerald-400 shrink-0" />
                <span><strong>Git & GitHub:</strong> Configure SSH key, verify commit signing, test clone DIPY / PyTorch-Ignite.</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-200">
                <BookmarkCheck size={14} className="text-emerald-400 shrink-0" />
                <span><strong>Environment:</strong> Python 3.11+, pytest, virtualenv, pre-commit hooks installed.</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-200">
                <BookmarkCheck size={14} className="text-emerald-400 shrink-0" />
                <span><strong>Organization Scan:</strong> Browse DIPY ideas list and join community Gitter channel.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Day Navigation Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm">
        <button
          onClick={() => prevDay && setActiveDayId(prevDay.id)}
          disabled={!prevDay}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Previous Day"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              {currentDay?.id.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {currentDay?.targetDate}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
            Day {currentIndex + 1} of {days.length}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              const matched = days.find(d => d.targetDate === todayStr);
              if (matched) setActiveDayId(matched.id);
              else setActiveDayId(days[0].id);
            }}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Jump to Today / Kick-off"
          >
            <Calendar size={18} />
          </button>
          <button
            onClick={() => nextDay && setActiveDayId(nextDay.id)}
            disabled={!nextDay}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Day"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 3. Main Day Card */}
      {currentDay && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-5">
          {/* Header & Meta */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {currentDay.phaseId.replace('gsoc-phase-', 'Phase ')}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Week {currentDay.weekNumber}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center space-x-1">
                <Clock size={12} />
                <span>{currentDay.coreMinutes} mins core</span>
              </span>
              {(currentDay.type === 'rest' || currentDay.type === 'buffer') && (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                  <Coffee size={12} />
                  <span>Scheduled Rest / Buffer</span>
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
              {currentDay.title}
            </h1>

            {/* Step Completion Meter */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-600">Daily Steps Progress</span>
                <span className={isDayFullyComplete ? 'text-emerald-600 font-black' : 'text-slate-600'}>
                  {completedStepsCount} of {totalSteps} Completed ({totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${isDayFullyComplete ? 'bg-emerald-500' : 'bg-teal-500'}`}
                  style={{ width: `${totalSteps > 0 ? (completedStepsCount / totalSteps) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Timer & Notes */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={handleStartTimer}
              className={`flex-1 min-w-[160px] flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl font-black text-xs transition-all shadow-sm ${
                isRunning && activeTrackId === 'gsoc2027'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
              }`}
            >
              <Play size={15} fill="currentColor" />
              <span>
                {isRunning && activeTrackId === 'gsoc2027' 
                  ? `Focusing: ${activeTopic.slice(0, 24)}...` 
                  : 'Start Focus Timer'}
              </span>
            </button>

            <button
              onClick={() => onOpenDayModal?.(currentDay.id)}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <FileText size={15} />
              <span>Evidence & Notes</span>
            </button>
          </div>

          {/* Step Checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Interactive Checklist
            </h3>

            <div className="space-y-2.5">
              {currentDay.steps.map((step, idx) => {
                const isStepDone = dayProgress.completedStepIds.includes(step.id);
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStepComplete(currentDay.id, step.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                      isStepDone 
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-700' 
                        : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-teal-600 shrink-0 focus:outline-none"
                      aria-label={isStepDone ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {isStepDone ? (
                        <CheckCircle2 size={18} className="text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle size={18} className="text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black tracking-tight ${isStepDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {idx + 1}. {step.kind.toUpperCase()}: {step.text}
                        </span>
                        {step.plannedMinutes && (
                          <span className="text-[10px] font-bold text-slate-400">
                            ~{step.plannedMinutes}m
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isStepDone ? 'text-slate-500' : 'text-slate-600'}`}>
                        Done when: {step.doneWhen}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Curated Resources for this day */}
          {dayResources.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Associated Study Resources</span>
                <button
                  onClick={() => onNavigateToTab?.('learn')}
                  className="text-teal-600 hover:underline font-bold normal-case text-[11px]"
                >
                  View All Resources &rarr;
                </button>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dayResources.map(res => (
                  <a
                    key={res.id}
                    href={res.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 transition-all flex items-start justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {res.type.toUpperCase()}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                        {res.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {res.channelOrPublisher || res.approximateDurationLabel || res.type}
                      </p>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-teal-600 shrink-0 ml-2 mt-1" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Evidence URLs if logged */}
          {dayProgress.evidenceUrls.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">
                Logged Work Evidence ({dayProgress.evidenceUrls.length})
              </h4>
              <div className="space-y-1">
                {dayProgress.evidenceUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-teal-600 hover:underline flex items-center space-x-1.5 truncate"
                  >
                    <ExternalLink size={12} className="shrink-0" />
                    <span className="truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Quick Shortcut Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigateToTab?.('roadmap')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors shadow-sm group"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Roadmap</span>
          <span className="text-xs font-black text-slate-900 group-hover:text-teal-600 flex items-center justify-between mt-0.5">
            <span>8 Phases</span>
            <ArrowRight size={13} />
          </span>
        </button>

        <button
          onClick={() => onNavigateToTab?.('orgs')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors shadow-sm group"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Orgs</span>
          <span className="text-xs font-black text-slate-900 group-hover:text-teal-600 flex items-center justify-between mt-0.5">
            <span>5 Candidates</span>
            <Compass size={13} />
          </span>
        </button>

        <button
          onClick={() => onNavigateToTab?.('contributions')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors shadow-sm group"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Contributions</span>
          <span className="text-xs font-black text-slate-900 group-hover:text-teal-600 flex items-center justify-between mt-0.5">
            <span>{metrics.contributionsCount.merged} Merged</span>
            <ArrowRight size={13} />
          </span>
        </button>

        <button
          onClick={() => onNavigateToTab?.('proposal')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors shadow-sm group"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Proposal</span>
          <span className="text-xs font-black text-slate-900 group-hover:text-teal-600 flex items-center justify-between mt-0.5">
            <span>{metrics.proposalReadinessScore}% Ready</span>
            <ArrowRight size={13} />
          </span>
        </button>
      </div>
    </div>
  );
};
