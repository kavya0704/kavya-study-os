import { create } from 'zustand';
import { StudyTask, StudySession } from '../types';
import { getDb } from '../services/db';

interface ProgressMetrics {
  focusedMinutesToday: number;
  focusedHoursThisWeek: number;
  completedTasksCount: number;
  requiredTasksCount: number;
  backlogCompletedCount: number; // 0 to 25
  backlogTotalCount: number; // 25
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
    backlogCompletedCount: 0,
    backlogTotalCount: 25,
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

      // 3. Backlog calculation (Strictly count distinct completed backlog video numbers 1-25)
      const allTasks: StudyTask[] = await db.getAll('study_tasks');
      const completedBacklogNumbers = new Set<number>();
      for (const t of allTasks) {
        if (t.category === 'masai_backlog' && t.status === 'completed' && t.backlogVideoNumber) {
          completedBacklogNumbers.add(t.backlogVideoNumber);
        }
      }
      const backlogCompletedCount = Math.min(25, completedBacklogNumbers.size);

      // 4. Week total
      const allSessions: StudySession[] = await db.getAll('study_sessions');
      const totalSessionSeconds = allSessions.reduce((sum, s) => sum + s.durationSeconds, 0);
      const focusedHoursThisWeek = Number((totalSessionSeconds / 3600).toFixed(1));

      // 5. Rest day check
      const day = await db.getFromIndex('study_days', 'by_date', dateStr);
      const pujaRestRespected = day?.isProtectedRestDay ?? false;

      set({
        metrics: {
          focusedMinutesToday,
          focusedHoursThisWeek,
          completedTasksCount,
          requiredTasksCount: requiredTasks.length,
          backlogCompletedCount,
          backlogTotalCount: 25,
          pujaRestRespected
        },
        isLoading: false
      });
    } catch (e) {
      console.error('Failed to refresh progress:', e);
      set({ isLoading: false });
    }
  }
}));
