import { getDb } from './db';
import { UserProfile, StudyDay, StudyTask } from '../../types';
import { DAYS } from '../../data/roadmap';

export const defaultProfile: UserProfile = {
  id: 'profile_kavya',
  displayName: 'Kavya Shaw',
  timezone: 'Asia/Kolkata',
  planStartDate: '2026-10-08',
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
    '2026-10-16',
    '2026-10-17',
    '2026-10-18',
    '2026-10-19',
    '2026-10-20',
    '2026-10-21',
    '2026-10-22',
    '2026-10-23',
    '2026-10-24',
    '2026-10-25'
  ],
  theme: 'dark',
  reducedMotion: false,
  defaultFocusIntervalMinutes: 25,
  groqApiKey: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GROQ_API_KEY || '',
  createdAt: '2026-10-08T00:00:00Z',
  updatedAt: '2026-10-08T00:00:00Z'
};

export interface DatabaseStats {
  daysCount: number;
  studyDaysCount: number;
  holidayDaysCount: number;
  tasksCount: number;
  completedDaysCount: number;
}

export async function checkAndSeedDatabase(): Promise<DatabaseStats> {
  const db = await getDb();
  
  // Check if profile exists in the new v2 database
  const existingProfile = await db.get('user_profile', 'profile_kavya');
  
  if (!existingProfile) {
    console.log('Seeding new 90-Day AI Engineer StudyOS database...');
    
    // 1. Profile
    await db.put('user_profile', defaultProfile);

    // 2. Days from single source of truth
    const dayTx = db.transaction('study_days', 'readwrite');
    for (let i = 0; i < DAYS.length; i++) {
      const d = DAYS[i];
      const studyDay: StudyDay = {
        id: `day-${d.date}`,
        date: d.date,
        dayNumber: d.day,
        weekNumber: Math.ceil((i + 1) / 7),
        phaseId: d.phaseId,
        phaseName: d.phaseName,
        topics: d.topics,
        isBuildDay: d.isBuildDay,
        englishLink: d.englishLink,
        hindiLink: d.hindiLink,
        timeSplit: d.timeSplit,
        practiceTask: d.practiceTask,
        doneWhen: d.doneWhen,
        hours: d.hours,
        isHoliday: d.isHoliday,
        holidayName: d.holidayName,
        dayType: d.isHoliday ? 'rest' : 'non_college',
        title: d.isHoliday ? (d.holidayName || 'Holiday') : (d.topics[0] || `Day ${d.day}`),
        plannedMinutes: Math.round(d.hours * 60),
        isProtectedRestDay: d.isHoliday,
        isCompleted: false,
        checklist: {
          topicsCovered: false,
          practiceTaskDone: false,
          doneWhenSatisfied: false
        },
        createdAt: '2026-10-08T00:00:00Z',
        updatedAt: '2026-10-08T00:00:00Z'
      };
      await dayTx.store.put(studyDay);
    }
    await dayTx.done;

    // 3. Tasks for study days
    const taskTx = db.transaction('study_tasks', 'readwrite');
    for (const d of DAYS) {
      if (!d.isHoliday && d.day !== null) {
        const studyTask: StudyTask = {
          id: `task-${d.date}`,
          studyDayId: `day-${d.date}`,
          order: 1,
          title: d.topics.join(' • '),
          topic: d.topics[0] || 'AI Engineering Study',
          description: d.practiceTask,
          definitionOfDone: d.doneWhen,
          category: d.isBuildDay ? 'project' : 'python_practice',
          isRequired: true,
          plannedMinutes: Math.round(d.hours * 60),
          actualMinutes: 0,
          status: 'pending',
          resourceIds: [],
          originalDate: d.date,
          currentDate: d.date,
          createdAt: '2026-10-08T00:00:00Z',
          updatedAt: '2026-10-08T00:00:00Z'
        };
        await taskTx.store.put(studyTask);
      }
    }
    await taskTx.done;

    console.log('Seeded 90-day AI Engineer curriculum successfully.');
  }

  // Calculate current database stats
  const allDays: StudyDay[] = await db.getAll('study_days');
  const allTasks: StudyTask[] = await db.getAll('study_tasks');
  const studyDaysCount = allDays.filter(d => !d.isHoliday).length;
  const holidayDaysCount = allDays.filter(d => d.isHoliday).length;
  const completedDaysCount = allDays.filter(d => d.isCompleted).length;

  return {
    daysCount: allDays.length,
    studyDaysCount,
    holidayDaysCount,
    tasksCount: allTasks.length,
    completedDaysCount
  };
}

export async function getStudyDayByDate(dateStr: string): Promise<StudyDay | undefined> {
  const db = await getDb();
  return db.getFromIndex('study_days', 'by_date', dateStr);
}

export async function getAllStudyDays(): Promise<StudyDay[]> {
  const db = await getDb();
  return db.getAll('study_days');
}

export async function getTasksForDate(dateStr: string): Promise<StudyTask[]> {
  const db = await getDb();
  return db.getAllFromIndex('study_tasks', 'by_currentDate', dateStr);
}

export async function toggleDayCompletion(dateStr: string): Promise<boolean> {
  const db = await getDb();
  const day: StudyDay | undefined = await db.getFromIndex('study_days', 'by_date', dateStr);
  if (!day) return false;

  const newStatus = !day.isCompleted;
  day.isCompleted = newStatus;
  day.completedAt = newStatus ? new Date().toISOString() : undefined;
  day.updatedAt = new Date().toISOString();
  await db.put('study_days', day);

  // Synchronize corresponding task if present
  const tasks = await getTasksForDate(dateStr);
  for (const t of tasks) {
    t.status = newStatus ? 'completed' : 'pending';
    t.completedAt = newStatus ? new Date().toISOString() : undefined;
    t.updatedAt = new Date().toISOString();
    await db.put('study_tasks', t);
  }

  return newStatus;
}

export async function updateDayNotes(dateStr: string, notes: string): Promise<void> {
  const db = await getDb();
  const day: StudyDay | undefined = await db.getFromIndex('study_days', 'by_date', dateStr);
  if (day) {
    day.notes = notes;
    day.updatedAt = new Date().toISOString();
    await db.put('study_days', day);
  }
}

export async function updateDayChecklist(
  dateStr: string,
  key: 'topicsCovered' | 'practiceTaskDone' | 'doneWhenSatisfied',
  value: boolean
): Promise<void> {
  const db = await getDb();
  const day: StudyDay | undefined = await db.getFromIndex('study_days', 'by_date', dateStr);
  if (day) {
    day.checklist = {
      topicsCovered: day.checklist?.topicsCovered || false,
      practiceTaskDone: day.checklist?.practiceTaskDone || false,
      doneWhenSatisfied: day.checklist?.doneWhenSatisfied || false,
      [key]: value
    };
    day.updatedAt = new Date().toISOString();
    await db.put('study_days', day);
  }
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
