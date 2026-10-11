import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Layers, 
  BookOpen, 
  Building2, 
  GitPullRequest, 
  FileText, 
  CalendarDays, 
  Trophy, 
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';
import { useGsocStore } from '../stores/useGsocStore';
import { 
  GsocTodayView, 
  GsocRoadmapView, 
  GsocDayDetailModal, 
  GsocLearnView, 
  GsocOrgsView, 
  GsocContributionsBoard, 
  GsocProposalWorkspace, 
  GsocCalendarView, 
  GsocProgressView 
} from '../components/gsoc';

export type GsocTab = 
  | 'today' 
  | 'roadmap' 
  | 'learn' 
  | 'orgs' 
  | 'contributions' 
  | 'proposal' 
  | 'calendar' 
  | 'progress';

interface GsocViewProps {
  initialTab?: GsocTab;
  onSwitchToAiml?: () => void;
}

export const GsocView: React.FC<GsocViewProps> = ({ 
  initialTab = 'today',
  onSwitchToAiml 
}) => {
  const { loadAll, isLoading } = useGsocStore();
  const [activeTab, setActiveTab] = useState<GsocTab>(initialTab);
  const [modalDayId, setModalDayId] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 pb-28 space-y-4 animate-in fade-in text-slate-900">
      {/* 1. Track Switcher & Header Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/10 text-teal-700 border border-teal-500/30 flex items-center space-x-1.5">
              <Sparkles size={12} className="text-teal-600" />
              <span>GSoC 2027 Hub</span>
            </span>

            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
              21 Oct 2026 - 31 May 2027 • 223 Target Days
            </span>
          </div>

          {onSwitchToAiml && (
            <button
              onClick={onSwitchToAiml}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors border border-slate-200"
              title="Switch to 90-Day AI/ML Sprint Roadmap"
            >
              <ArrowLeftRight size={13} />
              <span>Switch to AI/ML Sprint</span>
            </button>
          )}
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Google Summer of Code 2027 Preparation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Target Organization: <strong>DIPY (Diffusion Imaging in Python)</strong> & Scientific Python Ecosystem.
          </p>
        </div>

        {/* Sub-Navigation Chips Bar */}
        <div className="flex items-center space-x-1.5 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'today'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calendar size={13} />
            <span>Today's Target</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'roadmap'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Layers size={13} />
            <span>8 Phases</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'learn'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BookOpen size={13} />
            <span>Library (45)</span>
          </button>

          <button
            onClick={() => setActiveTab('orgs')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'orgs'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building2 size={13} />
            <span>Target Orgs</span>
          </button>

          <button
            onClick={() => setActiveTab('contributions')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'contributions'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <GitPullRequest size={13} />
            <span>Contributions</span>
          </button>

          <button
            onClick={() => setActiveTab('proposal')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'proposal'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <FileText size={13} />
            <span>Proposal</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'calendar'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <CalendarDays size={13} />
            <span>32-Wk Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'progress'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Trophy size={13} />
            <span>Scorecard</span>
          </button>
        </div>
      </div>

      {/* 2. Active Tab Screen */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-bold text-xs animate-pulse">
          Loading GSoC 2027 preparation workspace...
        </div>
      ) : (
        <div>
          {activeTab === 'today' && (
            <GsocTodayView
              onOpenDayModal={setModalDayId}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'roadmap' && (
            <GsocRoadmapView
              onOpenDayModal={setModalDayId}
              onSelectDay={() => setActiveTab('today')}
            />
          )}

          {activeTab === 'learn' && (
            <GsocLearnView />
          )}

          {activeTab === 'orgs' && (
            <GsocOrgsView />
          )}

          {activeTab === 'contributions' && (
            <GsocContributionsBoard />
          )}

          {activeTab === 'proposal' && (
            <GsocProposalWorkspace />
          )}

          {activeTab === 'calendar' && (
            <GsocCalendarView
              onOpenDayModal={setModalDayId}
              onSelectDay={() => setActiveTab('today')}
            />
          )}

          {activeTab === 'progress' && (
            <GsocProgressView />
          )}
        </div>
      )}

      {/* 3. Global Day Detail Modal */}
      {modalDayId && (
        <GsocDayDetailModal
          dayId={modalDayId}
          onClose={() => setModalDayId(null)}
        />
      )}
    </div>
  );
};
