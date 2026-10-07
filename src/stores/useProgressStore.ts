import { create } from 'zustand';
import { StudyTask, StudySession, StudyDay } from '../types';
import { getDb } from '../services/db';
import { PHASES, TOTAL_STUDY_DAYS } from '../data/roadmap';

export interface PhaseProgress {
  phaseId: number;
  phaseName: string;
  completedDays: number;
  totalDays: number;
  percentage: number;
}

export interface ProgressMetrics {
  focusedMinutesToday: number;
  focusedHoursThisWeek: number;
  completedTasksCount: number;
  requiredTasksCount: number;
  completedStudyDaysCount: number;
  totalStudyDays: number;
  overallPercentage: number;
  currentStreak: number;
  totalHoursStudied: number;
  projectedFinishDate: string;
  phaseProgress: PhaseProgress[];
  isHolidayToday: boolean;
  holidayNameToday?: string;
  // Backward compatibility
  backlogCompletedCount: number;
  backlogTotalCount: number;
  pujaRestRespected: boolean;
}

interface ProgressState {
  metrics: ProgressMetrics;
  isLoading: boolean;
  refreshProgress: (dateStr: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  metrics: {
    focusedMinutesToday: 0,
    focusedHoursThisWeek: 0,
    completedTasksCount: 0,
    requiredTasksCount: 0,
    completedStudyDaysCount: 0,
    totalStudyDays: TOTAL_STUDY_DAYS,
    overallPercentage: 0,
    currentStreak: 0,
    totalHoursStudied: 0,
    projectedFinishDate: '2027-01-17',
    phaseProgress: PHASES.map(p => ({
      phaseId: p.id,
      phaseName: p.name,
      completedDays: 0,
      totalDays: 15,
      percentage: 0
    })),
    isHolidayToday: false,
    holidayNameToday: undefined,
    backlogCompletedCount: 0,
    backlogTotalCount: TOTAL_STUDY_DAYS,
    pujaRestRespected: false
  },
  isLoading: true,

  refreshProgress: async (dateStr: string) => {
    try {
      const db = await getDb();
      
      // 1. Today's sessions
      const todaySessions: StudySession[] = await db.getAllFromIndex('study_sessions', 'by_date', dateStr);
      const todaySeconds = todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0);
      const focusedMinutesToday = Math.round(todaySeconds / 60);

      // 2. Today's tasks
      const todayTasks: StudyTask[] = await db.getAllFromIndex('study_tasks', 'by_currentDate', dateStr);
      const requiredTasks = todayTasks.filter(t => t.isRequired);
      const completedTasksCount = requiredTasks.filter(t => t.status === 'completed').length;

      // 3. All study days from DB
      const allDays: StudyDay[] = await db.getAll('study_days');
      const studyDays = allDays.filter(d => !d.isHoliday && d.dayNumber !== null);
      
      // Completed study days (either isCompleted flag or task completed)
      const completedStudyDays = studyDays.filter(d => d.isCompleted);
      const completedStudyDaysCount = completedStudyDays.length;
      const overallPercentage = Math.round((completedStudyDaysCount / TOTAL_STUDY_DAYS) * 100);

      // 4. Per-phase progress
      const phaseProgress: PhaseProgress[] = PHASES.map(p => {
        const daysInPhase = studyDays.filter(d => d.phaseId === p.id);
        const completedInPhase = daysInPhase.filter(d => d.isCompleted).length;
        const total = daysInPhase.length || 15;
        return {
          phaseId: p.id,
          phaseName: p.name,
          completedDays: completedInPhase,
          totalDays: total,
          percentage: Math.round((completedInPhase / total) * 100)
        };
      });

      // 5. Total hours studied (completed study days * 5.5 hours + session timer hours)
      const allSessions: StudySession[] = await db.getAll('study_sessions');
      const sessionSeconds = allSessions.reduce((sum, s) => sum + s.durationSeconds, 0);
      const timerHours = sessionSeconds / 3600;
      const totalHoursStudied = Number(((completedStudyDaysCount * 5.5) + (timerHours > 0 ? timerHours : 0)).toFixed(1));
      const focusedHoursThisWeek = Number((sessionSeconds / 3600).toFixed(1));

      // 6. Streak calculation (consecutive completed study days up to today)
      let currentStreak = 0;
      const sortedStudyDays = [...studyDays].sort((a, b) => a.date.localeCompare(b.date));
      for (const d of sortedStudyDays) {
        if (d.date > dateStr) break;
        if (d.isCompleted) {
          currentStreak++;
        } else if (d.date < dateStr) {
          // Reset streak if a past day was missed
          currentStreak = 0;
        }
      }

      // 7. Today status
      const todayDay = allDays.find(d => d.date === dateStr);
      const isHolidayToday = todayDay?.isHoliday ?? false;
      const holidayNameToday = todayDay?.holidayName;

      // 8. Projected finish date
      // If studying at least 1 day per calendar day, finish on Jan 17, 2027
      const projectedFinish = '2027-01-17';

      set({
        metrics: {
          focusedMinutesToday,
          focusedHoursThisWeek,
          completedTasksCount,
          requiredTasksCount: requiredTasks.length,
          completedStudyDaysCount,
          totalStudyDays: TOTAL_STUDY_DAYS,
          overallPercentage,
          currentStreak,
          totalHoursStudied,
          projectedFinishDate: projectedFinish,
          phaseProgress,
          isHolidayToday,
          holidayNameToday,
          backlogCompletedCount: completedStudyDaysCount,
          backlogTotalCount: TOTAL_STUDY_DAYS,
          pujaRestRespected: isHolidayToday
        },
        isLoading: false
      });
    } catch (e) {
      console.error('Failed to refresh progress:', e);
      set({ isLoading: false });
    }
  }
}));
