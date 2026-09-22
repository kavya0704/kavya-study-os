import React, { useEffect, useState } from 'react';
import { useTimerStore, useTaskStore, useProgressStore } from '../stores';
import { TimerDisplay } from '../components/timer/TimerDisplay';
import { TimerControls } from '../components/timer/TimerControls';
import { ManualSessionModal } from '../components/timer/ManualSessionModal';
import { formatSecondsToDisplay } from '../engines/timerReconstructor';
import { Clock, Plus, BookOpen, CheckCircle2 } from 'lucide-react';

export const TimerView: React.FC = () => {
  const {
    isRunning,
    isPaused,
    mode,
    activeTopic,
    elapsedSeconds,
    recentSessions,
    setMode,
    setActiveTopic,
    startTimer,
    pauseTimer,
    resumeTimer,
    finishSession,
    discardSession,
    loadRecentSessions,
    logManualSession
  } = useTimerStore();

  const { tasks, currentDate } = useTaskStore();
  const { refreshProgress } = useProgressStore();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  useEffect(() => {
    loadRecentSessions();
  }, [loadRecentSessions]);

  const handleFinish = async () => {
    await finishSession();
    await refreshProgress(currentDate);
  };

  const handleManualSave = async (
    date: string,
    durationMinutes: number,
    topic: string,
    note?: string,
    taskId?: string
  ) => {
    await logManualSession(date, durationMinutes, topic, note, taskId);
    await refreshProgress(currentDate);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-28 space-y-4 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Focus & Session Timer
          </h1>
          <p className="text-xs text-slate-500">
            Zero-Drift WebKit Clock Reconstructor
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus size={14} />
          <span>Log Offline</span>
        </button>
      </div>

      {/* Task / Topic Selector (if not running) */}
      {!isRunning && (
        <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-4 space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <BookOpen size={13} className="text-blue-600" />
            <span>Target Topic or Task</span>
          </label>
          <div className="flex gap-2">
            <select
              value={activeTopic}
              onChange={(e) => setActiveTopic(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="General AI/ML Revision">General AI/ML Revision</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title} ({t.plannedMinutes}m)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Circular Timer Display */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-4">
        <TimerDisplay
          elapsedSeconds={elapsedSeconds}
          mode={mode}
          isRunning={isRunning}
          isPaused={isPaused}
          activeTopic={activeTopic}
        />

        {/* Controls */}
        <TimerControls
          isRunning={isRunning}
          isPaused={isPaused}
          mode={mode}
          onSetMode={setMode}
          onStart={() => startTimer(undefined, activeTopic, mode)}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onFinish={handleFinish}
          onDiscard={discardSession}
        />
      </div>

      {/* Recent Session History */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <Clock size={13} className="text-blue-600" />
            <span>Recent Focused Sessions</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {recentSessions.length} recorded
          </span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="text-center py-6 bg-white border border-slate-100 rounded-2xl p-4 text-xs text-slate-500 shadow-xs">
            No study sessions logged yet. Hit Start Focus Session above!
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 text-xs shadow-xs"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                      {s.source === 'manual' ? 'Offline Log' : 'Live Timer'}
                    </span>
                    <span className="text-[10px] text-slate-400">• {s.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mt-1 truncate">{s.topic}</h4>
                  {s.note && (
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                      "{s.note}"
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {formatSecondsToDisplay(s.durationSeconds)}
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold flex items-center justify-end mt-0.5">
                    <CheckCircle2 size={10} className="mr-1" />
                    {Math.round(s.durationSeconds / 60)}m
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Session Entry Modal */}
      <ManualSessionModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        currentDateStr={currentDate}
        availableTasks={tasks}
        onSaveSession={handleManualSave}
      />
    </div>
  );
};
