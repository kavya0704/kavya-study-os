import { create } from 'zustand';
import { 
  InternshipOpening, 
  CURRENT_WEEKLY_INTERNSHIPS, 
  WeeklyInternshipBatch 
} from '../data/internships';

export type ApplicationStatus = 'none' | 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';

export interface ApplicationRecord {
  status: ApplicationStatus;
  appliedDate?: string;
  notes?: string;
}

interface InternshipStoreState {
  weeklyBatch: WeeklyInternshipBatch;
  applicationRecords: Record<string, ApplicationRecord>;
  customInternships: InternshipOpening[];
  
  // Getters & Computed
  getStatus: (id: string) => ApplicationStatus;
  getRecord: (id: string) => ApplicationRecord | undefined;
  getAppliedCount: () => number;
  getBookmarkedCount: () => number;
  getInterviewCount: () => number;

  // Actions
  setStatus: (id: string, status: ApplicationStatus) => void;
  setNotes: (id: string, notes: string) => void;
  addCustomInternship: (item: Omit<InternshipOpening, 'id' | 'weekNumber'>) => void;
  resetApplications: () => void;
}

const STORAGE_KEY = 'kavya_study_os_internships_v1';
const CUSTOM_STORAGE_KEY = 'kavya_study_os_custom_internships_v1';

function loadPersistedRecords(): Record<string, ApplicationRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadPersistedCustom(): InternshipOpening[] {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useInternshipStore = create<InternshipStoreState>((set, get) => ({
  weeklyBatch: CURRENT_WEEKLY_INTERNSHIPS,
  applicationRecords: loadPersistedRecords(),
  customInternships: loadPersistedCustom(),

  getStatus: (id: string) => {
    return get().applicationRecords[id]?.status || 'none';
  },

  getRecord: (id: string) => {
    return get().applicationRecords[id];
  },

  getAppliedCount: () => {
    const records = get().applicationRecords;
    return Object.values(records).filter(
      r => r.status === 'applied' || r.status === 'interviewing' || r.status === 'offered'
    ).length;
  },

  getBookmarkedCount: () => {
    const records = get().applicationRecords;
    return Object.values(records).filter(r => r.status === 'saved').length;
  },

  getInterviewCount: () => {
    const records = get().applicationRecords;
    return Object.values(records).filter(r => r.status === 'interviewing').length;
  },

  setStatus: (id: string, status: ApplicationStatus) => {
    set(state => {
      const existing = state.applicationRecords[id] || { status: 'none' };
      const updatedRecords = {
        ...state.applicationRecords,
        [id]: {
          ...existing,
          status,
          appliedDate: status === 'applied' && !existing.appliedDate 
            ? new Date().toISOString().split('T')[0] 
            : existing.appliedDate
        }
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      } catch (err) {
        console.warn('Failed to persist internship status:', err);
      }

      return { applicationRecords: updatedRecords };
    });
  },

  setNotes: (id: string, notes: string) => {
    set(state => {
      const existing = state.applicationRecords[id] || { status: 'none' };
      const updatedRecords = {
        ...state.applicationRecords,
        [id]: {
          ...existing,
          notes
        }
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      } catch (err) {
        console.warn('Failed to persist internship note:', err);
      }

      return { applicationRecords: updatedRecords };
    });
  },

  addCustomInternship: (item) => {
    const newOpening: InternshipOpening = {
      ...item,
      id: `custom-intern-${Date.now()}`,
      weekNumber: get().weeklyBatch.weekNumber
    };

    set(state => {
      const nextCustom = [newOpening, ...state.customInternships];
      try {
        localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(nextCustom));
      } catch (err) {
        console.warn('Failed to persist custom internship:', err);
      }
      return { customInternships: nextCustom };
    });
  },

  resetApplications: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    set({ applicationRecords: {} });
  }
}));
