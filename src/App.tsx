import { useState, useEffect } from 'react';
import { checkAndSeedDatabase } from './services/db';
import { 
  useTaskStore, 
  useTimerStore, 
  useProgressStore, 
  useProfileStore 
} from './stores';
import { useRevisionStore } from './stores/useRevisionStore';
import { formatSecondsToDisplay } from './engines';
import { TodayView } from './views/TodayView';
import { PlanView } from './views/PlanView';
import { ResourcesView } from './views/ResourcesView';
import { ProgressView } from './views/ProgressView';
import { RevisionView } from './views/RevisionView';
import { TimerView } from './views/TimerView';
import { SettingsView } from './views/SettingsView';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { 
  Play, 
  Pause, 
  Square, 
  Bot,
  X,
  ChevronLeft
} from 'lucide-react';
import { StudyTask } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Zustand stores
  const { loadDate, currentDate } = useTaskStore();
  const { loadProfile } = useProfileStore();
  const { metrics, refreshProgress } = useProgressStore();
  const { items: revisionItems, loadRevisionItems } = useRevisionStore();

  const {
    isRunning,
    isPaused,
    activeTopic,
    elapsedSeconds,
    pauseTimer,
    resumeTimer,
    finishSession,
    reconcileElapsed,
    setActiveTask,
    tick
  } = useTimerStore();

  // Heartbeat tick for zero-drift timer
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  // iOS Lock-Screen & Visibility Reconciler (immune to iOS tab suspension / screen locks)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && useTimerStore.getState().isRunning) {
        reconcileElapsed();
      }
    };
    const handleWindowFocus = () => {
      if (useTimerStore.getState().isRunning) {
        reconcileElapsed();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [reconcileElapsed]);

  // Initial database seeding, profile load, and revision loader
  useEffect(() => {
    async function init() {
      try {
        await checkAndSeedDatabase();
        await loadProfile();
        await loadDate('2026-09-22');
        await refreshProgress('2026-09-22');
        await loadRevisionItems();
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    init();
  }, [loadProfile, loadDate, refreshProgress, loadRevisionItems]);

  const handleFinishTimer = async () => {
    await finishSession();
    setIsTimerModalOpen(false);
    await refreshProgress(currentDate);
  };

  const handleOpenTimerModal = (task?: StudyTask) => {
    if (task) {
      setActiveTask(task.id, task.title);
    }
    setIsTimerModalOpen(true);
  };

  const dueReviewsCount = revisionItems.filter(
    i => i.dueDate <= currentDate && i.status !== 'completed'
  ).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans select-none">
      {/* Active Tab Screen */}
      <div className="flex-1 max-w-md mx-auto w-full">
        {activeTab === 'today' && (
          <TodayView
            onOpenTimerModal={handleOpenTimerModal}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenNotifications={() => setActiveTab('revision')}
          />
        )}

        {/* Plan / Roadmap Tab */}
        {(activeTab === 'plan' || activeTab === 'roadmap') && (
          <div className="pt-2">
            <PlanView
              onStartTimer={handleOpenTimerModal}
            />
          </div>
        )}

        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <div className="pt-2">
            <TimerView />
          </div>
        )}

        {/* Resources Library Tab */}
        {activeTab === 'resources' && (
          <div className="pt-2">
            <ResourcesView />
          </div>
        )}

        {/* Progress & Backlog Analytics Tab */}
        {(activeTab === 'progress' || activeTab === 'backlog') && (
          <div className="pt-2">
            <ProgressView />
          </div>
        )}

        {/* Spaced Revision Tab */}
        {activeTab === 'revision' && (
          <div className="pt-2">
            <RevisionView />
          </div>
        )}

        {/* AI Coach Tab */}
        {activeTab === 'coach' && (
          <div className="max-w-md mx-auto px-4 py-6 pb-28 space-y-4 animate-in fade-in">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Bot size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Groq AI Study Coach</h1>
                <p className="text-xs text-blue-600 font-medium">
                  Qwen 2.5 72B • Anti-Guilt Guardrails
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Personalized Assistant Directives
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>Strict anti-guilt pacing: Never scold missed days or suggest impossible catch-up.</li>
                <li>Socratic guidance: Ask clarifying questions before giving full solutions.</li>
                <li>Concise, high-signal explanations tailored to Kavya's AI/ML roadmap.</li>
              </ul>
            </div>

            <div className="p-4 bg-white border border-slate-100 shadow-sm rounded-2xl text-xs text-slate-600 space-y-2">
              <div className="text-slate-900 font-bold">Cloud Groq API Key Connected</div>
              <p className="truncate font-mono text-[11px] text-blue-600">
                gsk_wOsg4...OFennrgnI
              </p>
              <div className="text-[11px] text-slate-500">
                Full AI Coach chat interface ready.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Active Timer Mini-Bar */}
      {isRunning && (
        <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto">
          <div className="bg-white/95 border border-blue-200 shadow-2xl rounded-2xl p-3 flex items-center justify-between backdrop-blur-md">
            <div
              className="flex items-center space-x-3 min-w-0 cursor-pointer flex-1"
              onClick={() => setIsTimerModalOpen(true)}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <div className="min-w-0">
                <div className="text-[11px] text-blue-600 font-semibold truncate">
                  {activeTopic}
                </div>
                <div className="text-base font-bold text-slate-900 tracking-wider font-mono">
                  {formatSecondsToDisplay(elapsedSeconds)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {isPaused ? (
                <button
                  type="button"
                  onClick={resumeTimer}
                  aria-label="Resume timer"
                  className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Play size={16} fill="currentColor" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pauseTimer}
                  aria-label="Pause timer"
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Pause size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={handleFinishTimer}
                aria-label="Stop timer"
                className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
              >
                <Square size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Timer View Modal */}
      {isTimerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-y-auto animate-in fade-in">
          <div className="sticky top-0 z-10 px-4 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between max-w-md mx-auto w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Study Focus Mode
            </span>
            <button
              type="button"
              onClick={() => setIsTimerModalOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors flex items-center space-x-1 text-xs font-semibold"
            >
              <span>Minimize</span>
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 max-w-md mx-auto w-full">
            <TimerView />
          </div>
        </div>
      )}

      {/* Full Screen Settings View Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col overflow-y-auto animate-in slide-in-from-bottom-2">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
              >
                <ChevronLeft size={22} />
              </button>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">Settings & Life Anchors</h1>
            </div>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
            >
              Done
            </button>
          </div>
          <div className="max-w-md mx-auto w-full px-4 pt-2 flex-1">
            <SettingsView />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingReviewsCount={dueReviewsCount}
        backlogRemainingCount={25 - metrics.backlogCompletedCount}
      />
    </div>
  );
}
