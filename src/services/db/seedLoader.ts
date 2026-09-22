import { getDb } from './db';
import { UserProfile, StudyDay, StudyTask, Resource } from '../../types';

import seedDays from '../../data/seeds/days.json';
import seedTasks from '../../data/seeds/tasks.json';
import seedResources from '../../data/seeds/resources.json';

export const defaultProfile: UserProfile = {
  id: 'profile_kavya',
  displayName: 'Kavya Shaw',
  timezone: 'Asia/Kolkata',
  planStartDate: '2026-09-22',
  collegeWeekdays: [1, 3, 5], // Mon, Wed, Fri
  teachingBlock: {
    enabled: true,
    startTime: '16:30',
    endTime: '18:00'
  },
  gymBlock: {
    enabled: true,
    startTime: '06:30',
    endTime: '07:45'
  },
  pujaRestDates: [
    '2026-10-17',
    '2026-10-18',
    '2026-10-19',
    '2026-10-20',
    '2026-10-21'
  ],
  theme: 'light',
  reducedMotion: false,
  defaultFocusIntervalMinutes: 25,
  groqApiKey: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GROQ_API_KEY || '',
  createdAt: '2026-09-22T00:00:00Z',
  updatedAt: '2026-09-22T00:00:00Z'
};

export interface DatabaseStats {
  daysCount: number;
  tasksCount: number;
  resourcesCount: number;
  backlogTasksCount: number;
  pujaDaysCount: number;
}

export async function checkAndSeedDatabase(): Promise<DatabaseStats> {
  const db = await getDb();
  
  // Check if profile exists
  const existingProfile = await db.get('user_profile', 'profile_kavya');
  
  if (!existingProfile) {
    console.log('Seeding initial StudyOS database...');
    
    // 1. Profile
    await db.put('user_profile', defaultProfile);

    // 2. Days
    const dayTx = db.transaction('study_days', 'readwrite');
    for (const d of seedDays as StudyDay[]) {
      await dayTx.store.put(d);
    }
    await dayTx.done;

    // 3. Tasks
    const taskTx = db.transaction('study_tasks', 'readwrite');
    for (const t of seedTasks as StudyTask[]) {
      await taskTx.store.put(t);
    }
    await taskTx.done;

    // 4. Resources
    const resTx = db.transaction('resources', 'readwrite');
    for (const r of seedResources as Resource[]) {
      await resTx.store.put(r);
    }
    await resTx.done;

    console.log('Initial seed completed successfully.');
  }

  // Calculate stats
  const daysCount = await db.count('study_days');
  const tasksCount = await db.count('study_tasks');
  const resourcesCount = await db.count('resources');

  const allTasks: StudyTask[] = await db.getAll('study_tasks');
  const backlogTasksCount = allTasks.filter(t => t.category === 'masai_backlog').length;

  const allDays: StudyDay[] = await db.getAll('study_days');
  const pujaDaysCount = allDays.filter(d => d.isProtectedRestDay).length;

  return {
    daysCount,
    tasksCount,
    resourcesCount,
    backlogTasksCount,
    pujaDaysCount
  };
}

export async function getStudyDayByDate(dateStr: string): Promise<StudyDay | undefined> {
  const db = await getDb();
  return db.getFromIndex('study_days', 'by_date', dateStr);
}

export async function getTasksForDate(dateStr: string): Promise<StudyTask[]> {
  const db = await getDb();
  return db.getAllFromIndex('study_tasks', 'by_currentDate', dateStr);
}

export async function updateTaskStatus(taskId: string, status: 'pending' | 'completed' | 'skipped', actualMinutes?: number): Promise<void> {
  const db = await getDb();
  const task: StudyTask | undefined = await db.get('study_tasks', taskId);
  if (task) {
    task.status = status;
    if (actualMinutes !== undefined) task.actualMinutes = actualMinutes;
    if (status === 'completed') task.completedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
    await db.put('study_tasks', task);
  }
}
