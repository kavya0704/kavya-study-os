import React, { useState } from 'react';
import { StudyTask, StudyTaskSubtasks } from '../types';
import { useTaskStore, useTimerStore, useProgressStore } from '../stores';
import { useRevisionStore } from '../stores/useRevisionStore';
import { getNextRecommendedAction } from '../engines/recommendationEngine';
import { AppHeader } from '../components/layout/AppHeader';
import { NextActionHero } from '../components/task/NextActionHero';
import { TaskCard } from '../components/task/TaskCard';
import { ProgressRing } from '../components/common/ProgressRing';
import { Toast } from '../components/common/Toast';
import { VideoSubtaskGate } from '../components/task/VideoSubtaskGate';
import { TaskDetailSheet } from '../components/task/TaskDetailSheet';
import { ReflectionDrawer } from '../components/notes/ReflectionDrawer';
import { NotesSearchModal } from '../components/notes/NotesSearchModal';
import { AIDiagnosticModal } from '../components/ai/AIDiagnosticModal';
import { getDb } from '../services/db';
import { Sparkles } from 'lucide-react';

interface TodayViewProps {
  onOpenTimerModal?: (task?: StudyTask) => void;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  onOpenTimerModal,
  onOpenSettings,
  onOpenNotifications
}) => {
  const {
    currentDate,
    currentDay,
    tasks,
    isLoading,
    toggleTask,
    toggleSubtask,
    undoRecord,
    executeUndo,
    rescheduleTask,
    loadDate
  } = useTaskStore();

  const { startTimer } = useTimerStore();
  const { metrics, refreshProgress } = useProgressStore();
  const { createRevisionItemsForTask } = useRevisionStore();

  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<StudyTask | null>(null);
  const [videoGateTask, setVideoGateTask] = useState<StudyTask | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIDiagnosticOpen, setIsAIDiagnosticOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Date navigation helpers
  const handleDateChange = (offsetDays: number) => {
    const current = new Date(`${currentDate}T00:00:00`);
    current.setDate(current.getDate() + offsetDays);
    const newDateStr = current.toISOString().split('T')[0];

    // Constrain to roadmap window 2026-09-22 to 2026-12-31
    if (newDateStr >= '2026-09-22' && newDateStr <= '2026-12-31') {
      loadDate(newDateStr);
      refreshProgress(newDateStr);
    }
  };

  const handleGoToday = () => {
    loadDate('2026-09-22');
    refreshProgress('2026-09-22');
  };

  // Task completion toggle
  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // If it's a backlog video that is pending and missing subtasks, open the gate
    if (task.category === 'masai_backlog' && task.status !== 'completed') {
      const sub = task.subtasks;
      const allDone = sub && sub.watchedActively && sub.recreatedExample && sub.wroteRecallQuestions &&
                      sub.solvedVariations && sub.recordedDoubtOrMistake && sub.committedProof;
      if (!allDone) {
        setVideoGateTask(task);
        return;
      }
    }

    const res = await toggleTask(taskId);
    if (res.subtasksMissing) {
      setVideoGateTask(task);
      return;
    }

    if (res.completed) {
      setToastMessage('Task completed! Tap to undo.');
    } else {
      setToastMessage(null);
    }
    refreshProgress(currentDate);
  };

  // Callback when all 6 subtasks are confirmed in VideoSubtaskGate
  const handleCompleteFromGate = async (
    taskId: string,
    subtasks: StudyTaskSubtasks,
    proofUrl?: string,
    mistakeNote?: string
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const db = await getDb();
    const now = new Date().toISOString();

    const updatedTask: StudyTask = {
      ...task,
      subtasks,
      proofUrl: proofUrl || task.proofUrl,
      status: 'completed',
      completedAt: now,
      updatedAt: now
    };

    await db.put('study_tasks', updatedTask);

    if (mistakeNote) {
      await db.put('notes', {
        id: `mistake-${Date.now()}`,
        taskId: task.id,
        title: `Takeaway: ${task.title}`,
        content: mistakeNote,
        type: 'doubt',
        createdAt: now,
        updatedAt: now
      });
    }

    await createRevisionItemsForTask(updatedTask, currentDate);

    setVideoGateTask(null);
    await loadDate(currentDate);
    await refreshProgress(currentDate);
    setToastMessage(`Backlog Video #${task.backlogVideoNumber || '1'} verified & completed!`);
  };

  const handleToggleSubtask = async (taskId: string, key: keyof StudyTaskSubtasks) => {
    await toggleSubtask(taskId, key);
  };

  const handleUndo = async () => {
    await executeUndo();
    setToastMessage(null);
    refreshProgress(currentDate);
  };

  const handleStartTimer = (task: StudyTask) => {
    startTimer(task.id, task.title);
    if (onOpenTimerModal) {
      onOpenTimerModal(task);
    }
  };

  const isRestDay = Boolean(
    currentDay?.isProtectedRestDay ||
    (currentDate >= '2026-10-17' && currentDate <= '2026-10-21')
  );

  const nextAction = getNextRecommendedAction(tasks);
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  const plannedMinutes = tasks.length > 0 
    ? tasks.reduce((sum, t) => sum + (t.plannedMinutes || 0), 0)
    : (currentDay?.plannedMinutes || 270);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28 text-slate-900 flex flex-col font-sans select-none">
      {/* Top Header */}
      <AppHeader
        currentDay={currentDay}
        currentDateStr={currentDate}
        onPrevDay={() => handleDateChange(-1)}
        onNextDay={() => handleDateChange(1)}
        onToday={handleGoToday}
        streakCount={1}
        backlogProgress={{
          completed: metrics.backlogCompletedCount,
          total: metrics.backlogTotalCount
        }}
        focusedMinutesToday={metrics.focusedMinutesToday}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAIDiagnostic={() => setIsAIDiagnosticOpen(true)}
        onOpenSettings={onOpenSettings}
        onOpenNotifications={onOpenNotifications}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 space-y-4">
        {/* Festive Rest Notice if within 17-21 Oct */}
        {isRestDay && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 flex items-start space-x-3 shadow-xs">
            <Sparkles className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div className="text-xs leading-relaxed">
              <strong className="block text-sm font-bold text-amber-900">Durga Puja Break (17–21 Oct)</strong>
              All required study is paused to celebrate with family. Enjoy the festivities!
            </div>
          </div>
        )}

        {/* 1. Today's Progress Card */}
        <ProgressRing
          completedTasks={completedTasksCount}
          totalTasks={totalTasksCount}
          focusedMinutes={metrics.focusedMinutesToday}
          plannedMinutes={plannedMinutes}
          isRestDay={isRestDay}
        />

        {/* 2. Next Up Hero Card */}
        <NextActionHero
          task={nextAction}
          onStartTimer={handleStartTimer}
          onToggleComplete={handleToggleTask}
          isRestDay={isRestDay}
        />

        {/* 3. Daily Focus Checklist Section */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Daily focus
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {completedTasksCount}/{totalTasksCount} completed
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
              Loading today's curriculum tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center bg-white border border-slate-100 rounded-2xl p-4 text-slate-500 text-xs shadow-xs">
              No tasks scheduled for this date.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleTask={handleToggleTask}
                  onToggleSubtask={handleToggleSubtask}
                  onStartTimer={handleStartTimer}
                  onOpenDetails={(t) => setSelectedTaskForDetails(t)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Daily Reflection Drawer */}
        <section className="pt-2">
          <ReflectionDrawer currentDateStr={currentDate} />
        </section>
      </main>

      {/* Video Subtask Completion Gate Modal */}
      {videoGateTask && (
        <VideoSubtaskGate
          task={videoGateTask}
          isOpen={Boolean(videoGateTask)}
          onClose={() => setVideoGateTask(null)}
          onComplete={handleCompleteFromGate}
        />
      )}

      {/* Task Detail Sheet */}
      {selectedTaskForDetails && (
        <TaskDetailSheet
          task={selectedTaskForDetails}
          isOpen={Boolean(selectedTaskForDetails)}
          onClose={() => setSelectedTaskForDetails(null)}
          onStartTimer={handleStartTimer}
          onToggleComplete={handleToggleTask}
          onRescheduleTask={rescheduleTask}
          existingTasksOnTargetDate={tasks}
        />
      )}

      {/* Global Notes Search Modal */}
      <NotesSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* AI Diagnostic Modal */}
      <AIDiagnosticModal
        isOpen={isAIDiagnosticOpen}
        onClose={() => setIsAIDiagnosticOpen(false)}
      />

      {/* Undo Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onUndo={undoRecord ? handleUndo : undefined}
          onDismiss={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
