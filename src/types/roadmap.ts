import { DayType } from './user';

export type TaskCategory = 
  | 'masai_backlog' 
  | 'masai_live' 
  | 'python_practice' 
  | 'dsa_sql' 
  | 'ml_theory' 
  | 'project' 
  | 'recall' 
  | 'career';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface RoadmapPhase {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  order: number;
  description: string;
  exitEvidence: string;
}

export interface StudyDay {
  id: string; // 'day-2026-09-22'
  date: string; // '2026-09-22'
  dayNumber: number; // 1 to 101
  weekNumber: number; // 1 to 14
  phaseId: number; // 1 to 8
  dayType: DayType;
  title: string;
  plannedMinutes: number;
  isProtectedRestDay: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyTaskSubtasks {
  watchedActively: boolean;
  recreatedExample: boolean;
  wroteRecallQuestions: boolean;
  solvedVariations: boolean;
  recordedDoubtOrMistake: boolean;
  committedProof: boolean;
}

export interface StudyTask {
  id: string;
  studyDayId: string;
  order: number;
  title: string;
  description: string;
  definitionOfDone: string;
  category: TaskCategory;
  topic: string;
  isRequired: boolean;
  plannedMinutes: number;
  actualMinutes: number;
  status: TaskStatus;
  backlogVideoNumber?: number; // 1 to 25
  subtasks?: StudyTaskSubtasks;
  resourceIds: string[];
  proofUrl?: string;
  completedAt?: string;
  skippedReason?: string;
  originalDate: string;
  currentDate: string;
  createdAt: string;
  updatedAt: string;
}
