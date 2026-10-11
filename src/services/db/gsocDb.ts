import { openDB, IDBPDatabase } from 'idb';
import { 
  GSOC_ORGANIZATIONS, 
  GSOC_OFFICIAL_EVENTS, 
  GSOC_CONFIG 
} from '../../data/gsoc2027';
import type { 
  GsocSettings 
} from '../../types/gsoc';

export const GSOC_DB_NAME = 'kavya_studyos_gsoc_2027_v1';
export const GSOC_DB_VERSION = 1;

let gsocDbPromise: Promise<IDBPDatabase> | null = null;

export function getGsocDb(): Promise<IDBPDatabase> {
  if (!gsocDbPromise) {
    gsocDbPromise = openDB(GSOC_DB_NAME, GSOC_DB_VERSION, {
      upgrade(db) {
        // 1. Settings
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }

        // 2. Task Progress (keyed by dayId, e.g. gsoc-w01-a)
        if (!db.objectStoreNames.contains('task_progress')) {
          db.createObjectStore('task_progress', { keyPath: 'dayId' });
        }

        // 3. Day Overrides (for personal rescheduling)
        if (!db.objectStoreNames.contains('day_overrides')) {
          db.createObjectStore('day_overrides', { keyPath: 'dayId' });
        }

        // 4. Study Sessions
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('by_dayId', 'dayId');
          sessionStore.createIndex('by_date', 'date');
        }

        // 5. Notes
        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
          noteStore.createIndex('by_dayId', 'dayId');
          noteStore.createIndex('by_updatedAt', 'updatedAt');
        }

        // 6. Organization Research
        if (!db.objectStoreNames.contains('organizations')) {
          const orgStore = db.createObjectStore('organizations', { keyPath: 'id' });
          orgStore.createIndex('by_status', 'status');
        }

        // 7. Contributions Board
        if (!db.objectStoreNames.contains('contributions')) {
          const contribStore = db.createObjectStore('contributions', { keyPath: 'id' });
          contribStore.createIndex('by_orgId', 'orgId');
          contribStore.createIndex('by_state', 'state');
        }

        // 8. Proposal Drafts
        if (!db.objectStoreNames.contains('proposals')) {
          db.createObjectStore('proposals', { keyPath: 'id' });
        }

        // 9. Proposal Snapshots
        if (!db.objectStoreNames.contains('proposal_versions')) {
          const verStore = db.createObjectStore('proposal_versions', { keyPath: 'id' });
          verStore.createIndex('by_proposalId', 'proposalId');
        }

        // 10. Official Events
        if (!db.objectStoreNames.contains('official_events')) {
          db.createObjectStore('official_events', { keyPath: 'id' });
        }
      }
    });
  }
  return gsocDbPromise;
}

/**
 * Initializes default organizations and unannounced official events if not already present.
 */
export async function initGsocDb(): Promise<void> {
  const db = await getGsocDb();

  // 1. Check & seed organizations
  const orgCount = await db.count('organizations');
  if (orgCount === 0) {
    const tx = db.transaction('organizations', 'readwrite');
    for (const org of GSOC_ORGANIZATIONS) {
      await tx.store.put(org);
    }
    await tx.done;
  }

  // 2. Check & seed official events
  const eventCount = await db.count('official_events');
  if (eventCount === 0) {
    const tx = db.transaction('official_events', 'readwrite');
    for (const evt of GSOC_OFFICIAL_EVENTS) {
      await tx.store.put(evt);
    }
    await tx.done;
  }

  // 3. Default settings
  const settings = await db.get('settings', 'main_config');
  if (!settings) {
    const defaultSettings: GsocSettings & { id: string } = {
      id: 'main_config',
      capacityMinutesWeekday: 90,
      capacityMinutesWeekend: 120,
      collegeWeekdays: [1, 3, 5], // Mon, Wed, Fri
      preferredOrgId: 'dipy',
      backupOrgId: 'ignite',
      startDate: GSOC_CONFIG.startDate
    };
    await db.put('settings', defaultSettings);
  }
}

/**
 * Resets ONLY the GSoC database without affecting the AI/ML database or settings.
 */
export async function resetGsocDbOnly(): Promise<void> {
  const db = await getGsocDb();
  const stores = [
    'task_progress', 
    'day_overrides', 
    'sessions', 
    'notes', 
    'contributions', 
    'proposals', 
    'proposal_versions'
  ];

  for (const storeName of stores) {
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.clear();
    await tx.done;
  }

  // Re-seed default orgs and events
  await initGsocDb();
}
