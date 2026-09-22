import { getDb } from '../db/db';
import { defaultProfile } from '../db/seedLoader';
import { 
  UserProfile, 
  StudyDay, 
  StudyTask, 
  StudySession, 
  Note, 
  Resource, 
  RevisionItem, 
  ApplicationRecord 
} from '../../types';

import seedDays from '../../data/seeds/days.json';
import seedTasks from '../../data/seeds/tasks.json';
import seedResources from '../../data/seeds/resources.json';

export interface StudyOsBackupData {
  version: number;
  exportedAt: string;
  app: string;
  data: {
    user_profile: UserProfile[];
    study_days: StudyDay[];
    study_tasks: StudyTask[];
    study_sessions: StudySession[];
    notes: Note[];
    resources: Resource[];
    revision_items: RevisionItem[];
    application_records: ApplicationRecord[];
  };
  stats: {
    daysCount: number;
    tasksCount: number;
    sessionsCount: number;
    notesCount: number;
    resourcesCount: number;
    revisionsCount: number;
  };
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  backupData?: StudyOsBackupData;
  summary?: string;
}

/**
 * Exports all IndexedDB tables to a single timestamped JSON file and initiates browser download.
 */
export async function exportStudyOsBackup(): Promise<StudyOsBackupData> {
  const db = await getDb();

  const userProfile = await db.getAll('user_profile') as UserProfile[];
  const studyDays = await db.getAll('study_days') as StudyDay[];
  const studyTasks = await db.getAll('study_tasks') as StudyTask[];
  const studySessions = await db.getAll('study_sessions') as StudySession[];
  const notes = await db.getAll('notes') as Note[];
  const resources = await db.getAll('resources') as Resource[];
  const revisionItems = await db.getAll('revision_items') as RevisionItem[];
  const applicationRecords = await db.getAll('application_records') as ApplicationRecord[];

  const backupData: StudyOsBackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'Kavya StudyOS',
    data: {
      user_profile: userProfile,
      study_days: studyDays,
      study_tasks: studyTasks,
      study_sessions: studySessions,
      notes: notes,
      resources: resources,
      revision_items: revisionItems,
      application_records: applicationRecords
    },
    stats: {
      daysCount: studyDays.length,
      tasksCount: studyTasks.length,
      sessionsCount: studySessions.length,
      notesCount: notes.length,
      resourcesCount: resources.length,
      revisionsCount: revisionItems.length
    }
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 5).replace(/:/g, '');
  const filename = `kavya_studyos_backup_${dateStr}_${timeStr}.json`;

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return backupData;
}

/**
 * Validates a raw JSON string to ensure it satisfies StudyOS backup specifications.
 */
export function validateBackupJson(rawJson: string): ValidationResult {
  try {
    const parsed = JSON.parse(rawJson);

    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'File does not contain a valid JSON object.' };
    }

    if (parsed.app !== 'Kavya StudyOS') {
      return { valid: false, error: 'Unrecognized backup file. Expected "app": "Kavya StudyOS".' };
    }

    if (!parsed.data || typeof parsed.data !== 'object') {
      return { valid: false, error: 'Backup file is missing the root "data" store container.' };
    }

    const { data } = parsed;
    if (!Array.isArray(data.study_days) || !Array.isArray(data.study_tasks)) {
      return { valid: false, error: 'Required datasets (study_days, study_tasks) are missing or invalid.' };
    }

    const daysCount = data.study_days.length;
    const tasksCount = data.study_tasks.length;
    const notesCount = Array.isArray(data.notes) ? data.notes.length : 0;
    const sessionsCount = Array.isArray(data.study_sessions) ? data.study_sessions.length : 0;

    const summary = `${daysCount} days, ${tasksCount} tasks, ${notesCount} notes, ${sessionsCount} timer sessions.`;

    return {
      valid: true,
      backupData: parsed as StudyOsBackupData,
      summary
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'JSON parsing failure';
    return { valid: false, error: `Invalid JSON format: ${message}` };
  }
}

/**
 * Safely restores an entire database from a validated backup data object.
 */
export async function restoreStudyOsBackup(backup: StudyOsBackupData): Promise<{ success: boolean; restoredCounts: Record<string, number> }> {
  const db = await getDb();
  const { data } = backup;

  // 1. user_profile
  if (Array.isArray(data.user_profile) && data.user_profile.length > 0) {
    const tx = db.transaction('user_profile', 'readwrite');
    await tx.store.clear();
    for (const p of data.user_profile) {
      await tx.store.put(p);
    }
    await tx.done;
  }

  // 2. study_days
  if (Array.isArray(data.study_days) && data.study_days.length > 0) {
    const tx = db.transaction('study_days', 'readwrite');
    await tx.store.clear();
    for (const d of data.study_days) {
      await tx.store.put(d);
    }
    await tx.done;
  }

  // 3. study_tasks
  if (Array.isArray(data.study_tasks) && data.study_tasks.length > 0) {
    const tx = db.transaction('study_tasks', 'readwrite');
    await tx.store.clear();
    for (const t of data.study_tasks) {
      await tx.store.put(t);
    }
    await tx.done;
  }

  // 4. study_sessions
  if (Array.isArray(data.study_sessions)) {
    const tx = db.transaction('study_sessions', 'readwrite');
    await tx.store.clear();
    for (const s of data.study_sessions) {
      await tx.store.put(s);
    }
    await tx.done;
  }

  // 5. notes
  if (Array.isArray(data.notes)) {
    const tx = db.transaction('notes', 'readwrite');
    await tx.store.clear();
    for (const n of data.notes) {
      await tx.store.put(n);
    }
    await tx.done;
  }

  // 6. resources
  if (Array.isArray(data.resources) && data.resources.length > 0) {
    const tx = db.transaction('resources', 'readwrite');
    await tx.store.clear();
    for (const r of data.resources) {
      await tx.store.put(r);
    }
    await tx.done;
  }

  // 7. revision_items
  if (Array.isArray(data.revision_items)) {
    const tx = db.transaction('revision_items', 'readwrite');
    await tx.store.clear();
    for (const rev of data.revision_items) {
      await tx.store.put(rev);
    }
    await tx.done;
  }

  // 8. application_records
  if (Array.isArray(data.application_records)) {
    const tx = db.transaction('application_records', 'readwrite');
    await tx.store.clear();
    for (const app of data.application_records) {
      await tx.store.put(app);
    }
    await tx.done;
  }

  return {
    success: true,
    restoredCounts: {
      days: data.study_days?.length || 0,
      tasks: data.study_tasks?.length || 0,
      sessions: data.study_sessions?.length || 0,
      notes: data.notes?.length || 0,
      resources: data.resources?.length || 0,
      revisions: data.revision_items?.length || 0
    }
  };
}

/**
 * Resets database back to clean canonical factory defaults.
 */
export async function resetDatabaseToDefaults(): Promise<void> {
  const db = await getDb();

  // 1. Reset user_profile
  const profTx = db.transaction('user_profile', 'readwrite');
  await profTx.store.clear();
  await profTx.store.put(defaultProfile);
  await profTx.done;

  // 2. Reset study_days
  const dayTx = db.transaction('study_days', 'readwrite');
  await dayTx.store.clear();
  for (const d of seedDays as StudyDay[]) {
    await dayTx.store.put(d);
  }
  await dayTx.done;

  // 3. Reset study_tasks
  const taskTx = db.transaction('study_tasks', 'readwrite');
  await taskTx.store.clear();
  for (const t of seedTasks as StudyTask[]) {
    await taskTx.store.put(t);
  }
  await taskTx.done;

  // 4. Reset resources
  const resTx = db.transaction('resources', 'readwrite');
  await resTx.store.clear();
  for (const r of seedResources as Resource[]) {
    await resTx.store.put(r);
  }
  await resTx.done;

  // 5. Clear volatile stores
  const sessionTx = db.transaction('study_sessions', 'readwrite');
  await sessionTx.store.clear();
  await sessionTx.done;

  const noteTx = db.transaction('notes', 'readwrite');
  await noteTx.store.clear();
  await noteTx.done;

  const revTx = db.transaction('revision_items', 'readwrite');
  await revTx.store.clear();
  await revTx.done;

  const appTx = db.transaction('application_records', 'readwrite');
  await appTx.store.clear();
  await appTx.done;
}
