export type FocusIntervalMode = 'stopwatch' | 'pomodoro_25_5' | 'deep_50_10' | 'manual';

export interface StudySession {
  id: string;
  taskId?: string;
  date: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  pausedDurationSeconds: number;
  source: 'timer' | 'manual';
  topic: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
