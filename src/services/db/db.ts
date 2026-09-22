import { openDB, IDBPDatabase } from 'idb';

export const DB_NAME = 'kavya_studyos_db';
export const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // 1. user_profile
        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'id' });
        }

        // 2. study_days
        if (!db.objectStoreNames.contains('study_days')) {
          const dayStore = db.createObjectStore('study_days', { keyPath: 'id' });
          dayStore.createIndex('by_date', 'date', { unique: true });
          dayStore.createIndex('by_week', 'weekNumber');
          dayStore.createIndex('by_phase', 'phaseId');
        }

        // 3. study_tasks
        if (!db.objectStoreNames.contains('study_tasks')) {
          const taskStore = db.createObjectStore('study_tasks', { keyPath: 'id' });
          taskStore.createIndex('by_dayId', 'studyDayId');
          taskStore.createIndex('by_currentDate', 'currentDate');
          taskStore.createIndex('by_category', 'category');
          taskStore.createIndex('by_status', 'status');
          taskStore.createIndex('by_backlogVideo', 'backlogVideoNumber');
        }

        // 4. study_sessions
        if (!db.objectStoreNames.contains('study_sessions')) {
          const sessionStore = db.createObjectStore('study_sessions', { keyPath: 'id' });
          sessionStore.createIndex('by_date', 'date');
          sessionStore.createIndex('by_taskId', 'taskId');
        }

        // 5. notes
        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
          noteStore.createIndex('by_taskId', 'taskId');
          noteStore.createIndex('by_type', 'type');
          noteStore.createIndex('by_pinned', 'isPinned');
        }

        // 6. resources
        if (!db.objectStoreNames.contains('resources')) {
          const resStore = db.createObjectStore('resources', { keyPath: 'id' });
          resStore.createIndex('by_category', 'category');
          resStore.createIndex('by_type', 'type');
          resStore.createIndex('by_primary', 'isPrimary');
        }

        // 7. revision_items
        if (!db.objectStoreNames.contains('revision_items')) {
          const revStore = db.createObjectStore('revision_items', { keyPath: 'id' });
          revStore.createIndex('by_dueDate', 'dueDate');
          revStore.createIndex('by_status', 'status');
        }

        // 8. application_records
        if (!db.objectStoreNames.contains('application_records')) {
          const appStore = db.createObjectStore('application_records', { keyPath: 'id' });
          appStore.createIndex('by_status', 'status');
          appStore.createIndex('by_dateApplied', 'dateApplied');
        }
      }
    });
  }
  return dbPromise;
}
