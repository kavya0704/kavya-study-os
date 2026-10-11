import { create } from 'zustand';
import { FocusIntervalMode, StudySession, TrackId } from '../types';
import { getDb } from '../services/db';
import { calculateTrueElapsedSeconds } from '../engines/timerReconstructor';

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  mode: FocusIntervalMode;
  activeTaskId?: string;
  activeTrackId?: TrackId;
  activeDayId?: string;
  activeTopic: string;
  startTimestamp: number;
  pauseStartTimestamp: number;
  pausedDurationMs: number;
  elapsedSeconds: number;
  recentSessions: StudySession[];

  setMode: (mode: FocusIntervalMode) => void;
  setActiveTopic: (topic: string) => void;
  setActiveTask: (taskId?: string, topic?: string, trackId?: TrackId, dayId?: string) => void;
  startTimer: (taskId?: string, topic?: string, mode?: FocusIntervalMode, trackId?: TrackId, dayId?: string) => void;
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
    taskId?: string,
    trackId?: TrackId,
    dayId?: string
  ) => Promise<StudySession>;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  isPaused: false,
  mode: 'stopwatch',
  activeTaskId: undefined,
  activeTrackId: undefined,
  activeDayId: undefined,
  activeTopic: 'General Revision',
  startTimestamp: 0,
  pauseStartTimestamp: 0,
  pausedDurationMs: 0,
  elapsedSeconds: 0,
  recentSessions: [],

  setMode: (mode) => set({ mode }),
  setActiveTopic: (activeTopic) => set({ activeTopic }),
  setActiveTask: (activeTaskId, activeTopic, trackId, dayId) => {
    set({
      activeTaskId,
      activeTrackId: trackId ?? get().activeTrackId,
      activeDayId: dayId ?? get().activeDayId,
      activeTopic: activeTopic || get().activeTopic
    });
  },

  startTimer: (taskId, topic, mode, trackId, dayId) => {
    const now = Date.now();
    set({
      isRunning: true,
      isPaused: false,
      mode: mode || get().mode,
      activeTaskId: taskId ?? get().activeTaskId,
      activeTrackId: trackId ?? get().activeTrackId,
      activeDayId: dayId ?? get().activeDayId,
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
    const { isRunning, startTimestamp, pausedDurationMs, activeTaskId, activeTrackId, activeDayId, activeTopic, elapsedSeconds } = get();
    if (!isRunning || elapsedSeconds <= 5) {
      get().discardSession();
      return null;
    }

    const session: StudySession = {
      id: `session-${Date.now()}`,
      taskId: activeTaskId,
      trackId: activeTrackId,
      dayId: activeDayId,
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

    // If track is gsoc2027, also log to GSoC database store
    if (activeTrackId === 'gsoc2027') {
      try {
        const { useGsocStore } = await import('./useGsocStore');
        await useGsocStore.getState().logStudySession({
          dayId: activeDayId || 'gsoc-manual',
          taskTitle: activeTopic,
          startTime: new Date(startTimestamp).toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: elapsedSeconds,
          date: new Date(startTimestamp).toISOString().split('T')[0]
        });
      } catch (err) {
        console.error('Failed to log GSoC study session:', err);
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
      activeTrackId: undefined,
      activeDayId: undefined,
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

  logManualSession: async (date, durationMinutes, topic, note, taskId, trackId, dayId) => {
    const durationSeconds = durationMinutes * 60;
    const now = new Date().toISOString();
    const session: StudySession = {
      id: `session-manual-${Date.now()}`,
      taskId,
      trackId,
      dayId,
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

    // If track is gsoc2027, also log to GSoC database store
    if (trackId === 'gsoc2027') {
      try {
        const { useGsocStore } = await import('./useGsocStore');
        await useGsocStore.getState().logStudySession({
          dayId: dayId || 'gsoc-manual',
          taskTitle: topic,
          startTime: now,
          endTime: now,
          durationSeconds,
          date
        });
      } catch (err) {
        console.error('Failed to log GSoC study session:', err);
      }
    }

    await get().loadRecentSessions();
    return session;
  }
}));
