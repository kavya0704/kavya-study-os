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
  name: string;
  title: string;
  startDay: number;
  endDay: number;
  learn: string[];
  build: string[];
  outcome: string;
  startDate?: string;
  endDate?: string;
  order?: number;
  description?: string;
  exitEvidence?: string;
}

export interface DayChecklist {
  topicsCovered: boolean;
  practiceTaskDone: boolean;
  doneWhenSatisfied: boolean;
}

export interface StudyDay {
  id: string; // 'day-YYYY-MM-DD'
  date: string; // 'YYYY-MM-DD'
  dayNumber: number | null; // 1 to 90 (null for holidays)
  weekNumber: number;
  phaseId: number; // 1 to 6
  phaseName: string;
  topics: string[];
  isBuildDay: boolean;
  englishLink: string | null;
  hindiLink: string | null;
  timeSplit: string;
  practiceTask: string;
  doneWhen: string;
  hours: number;
  isHoliday: boolean;
  holidayName?: string;
  dayType?: DayType;
  title?: string;
  plannedMinutes: number;
  isProtectedRestDay: boolean;
  isCompleted?: boolean;
  completedAt?: string;
  checklist?: DayChecklist;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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
