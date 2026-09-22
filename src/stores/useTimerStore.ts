import { create } from 'zustand';
import { FocusIntervalMode, StudySession } from '../types';
import { getDb } from '../services/db';
import { calculateTrueElapsedSeconds } from '../engines/timerReconstructor';

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  mode: FocusIntervalMode;
  activeTaskId?: string;
  activeTopic: string;
  startTimestamp: number;
  pauseStartTimestamp: number;
  pausedDurationMs: number;
  elapsedSeconds: number;
  recentSessions: StudySession[];

  setMode: (mode: FocusIntervalMode) => void;
  setActiveTopic: (topic: string) => void;
  setActiveTask: (taskId?: string, topic?: string) => void;
  startTimer: (taskId?: string, topic?: string, mode?: FocusIntervalMode) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  finishSession: (note?: string) => Promise<StudySession | null>;
  discardSession: () => void;
  reconcileElapsed: () => void;
  tick: () => void;
  loadRecentSessions: () => Promise<void>;
  logManualSession: (
    date: string,
    durationMinutes: number,
    topic: string,
    note?: string,
    taskId?: string
  ) => Promise<StudySession>;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  isPaused: false,
  mode: 'stopwatch',
  activeTaskId: undefined,
  activeTopic: 'General Revision',
  startTimestamp: 0,
  pauseStartTimestamp: 0,
  pausedDurationMs: 0,
  elapsedSeconds: 0,
  recentSessions: [],

  setMode: (mode) => set({ mode }),
  setActiveTopic: (activeTopic) => set({ activeTopic }),
  setActiveTask: (activeTaskId, activeTopic) => {
    set({
      activeTaskId,
      activeTopic: activeTopic || get().activeTopic
    });
  },

  startTimer: (taskId, topic, mode) => {
    const now = Date.now();
    set({
      isRunning: true,
      isPaused: false,
      mode: mode || get().mode,
      activeTaskId: taskId ?? get().activeTaskId,
      activeTopic: topic ?? get().activeTopic,
      startTimestamp: now,
      pauseStartTimestamp: 0,
      pausedDurationMs: 0,
      elapsedSeconds: 0
    });
  },

  pauseTimer: () => {
    if (!get().isRunning || get().isPaused) return;
    set({
      isPaused: true,
      pauseStartTimestamp: Date.now()
    });
  },

  resumeTimer: () => {
    const { isPaused, pauseStartTimestamp, pausedDurationMs } = get();
    if (!isPaused) return;

    const additionalPauseMs = Date.now() - pauseStartTimestamp;
    set({
      isPaused: false,
      pauseStartTimestamp: 0,
      pausedDurationMs: pausedDurationMs + additionalPauseMs
    });
  },

  reconcileElapsed: () => {
    const { isRunning, isPaused, startTimestamp, pausedDurationMs, pauseStartTimestamp } = get();
    if (!isRunning) return;

    let currentTotalPaused = pausedDurationMs;
    if (isPaused && pauseStartTimestamp > 0) {
      currentTotalPaused += (Date.now() - pauseStartTimestamp);
    }

    const trueElapsed = calculateTrueElapsedSeconds(startTimestamp, currentTotalPaused);
    set({ elapsedSeconds: trueElapsed });
  },

  tick: () => {
    const { isRunning, isPaused } = get();
    if (isRunning && !isPaused) {
      get().reconcileElapsed();
    }
  },

  finishSession: async (note) => {
    const { isRunning, startTimestamp, pausedDurationMs, activeTaskId, activeTopic, elapsedSeconds } = get();
    if (!isRunning || elapsedSeconds <= 5) {
      get().discardSession();
      return null;
    }

    const session: StudySession = {
      id: `session-${Date.now()}`,
      taskId: activeTaskId,
      date: new Date(startTimestamp).toISOString().split('T')[0],
      startedAt: new Date(startTimestamp).toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      pausedDurationSeconds: Math.floor(pausedDurationMs / 1000),
      source: 'timer',
      topic: activeTopic,
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const db = await getDb();
    await db.put('study_sessions', session);

    // If attached to a task, update task's actual minutes
    if (activeTaskId) {
      const task = await db.get('study_tasks', activeTaskId);
      if (task) {
        const addedMins = Math.round(elapsedSeconds / 60);
        task.actualMinutes = (task.actualMinutes || 0) + addedMins;
        task.updatedAt = new Date().toISOString();
        await db.put('study_tasks', task);
      }
    }

    get().discardSession();
    await get().loadRecentSessions();
    return session;
  },

  discardSession: () => {
    set({
      isRunning: false,
      isPaused: false,
      activeTaskId: undefined,
      activeTopic: 'General Revision',
      startTimestamp: 0,
      pauseStartTimestamp: 0,
      pausedDurationMs: 0,
      elapsedSeconds: 0
    });
  },

  loadRecentSessions: async () => {
    try {
      const db = await getDb();
      const all: StudySession[] = await db.getAll('study_sessions');
      const sorted = all.sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 15);
      set({ recentSessions: sorted });
    } catch (err) {
      console.error('Failed to load recent sessions:', err);
    }
  },

  logManualSession: async (date, durationMinutes, topic, note, taskId) => {
    const durationSeconds = durationMinutes * 60;
    const now = new Date().toISOString();
    const session: StudySession = {
      id: `session-manual-${Date.now()}`,
      taskId,
      date,
      startedAt: now,
      endedAt: now,
      durationSeconds,
      pausedDurationSeconds: 0,
      source: 'manual',
      topic,
      note,
      createdAt: now,
      updatedAt: now
    };

    const db = await getDb();
    await db.put('study_sessions', session);

    // Update attached task actual minutes if present
    if (taskId) {
      const task = await db.get('study_tasks', taskId);
      if (task) {
        task.actualMinutes = (task.actualMinutes || 0) + durationMinutes;
        task.updatedAt = now;
        await db.put('study_tasks', task);
      }
    }

    await get().loadRecentSessions();
    return session;
  }
}));
