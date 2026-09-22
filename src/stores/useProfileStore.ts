import { create } from 'zustand';
import { UserProfile } from '../types';
import { getDb, defaultProfile } from '../services/db';

interface ProfileState {
  profile: UserProfile;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  updateCollegeWeekdays: (days: number[]) => Promise<void>;
  updateTeachingBlock: (startTime: string, endTime: string, enabled: boolean) => Promise<void>;
  updateGymBlock: (startTime: string, endTime: string, enabled: boolean) => Promise<void>;
  updateGroqApiKey: (key: string) => Promise<void>;
  updateDefaultFocusIntervalMinutes: (minutes: number) => Promise<void>;
  updateTheme: (theme: 'dark' | 'light' | 'system') => Promise<void>;
  updateReducedMotion: (reduced: boolean) => Promise<void>;
  reloadProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,
  isLoading: true,

  loadProfile: async () => {
    try {
      const db = await getDb();
      const p = await db.get('user_profile', 'profile_kavya') as UserProfile | undefined;
      if (p) {
        set({ profile: p, isLoading: false });
      } else {
        await db.put('user_profile', defaultProfile);
        set({ profile: defaultProfile, isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
      set({ isLoading: false });
    }
  },

  reloadProfile: async () => {
    try {
      const db = await getDb();
      const p = await db.get('user_profile', 'profile_kavya') as UserProfile | undefined;
      if (p) {
        set({ profile: p });
      }
    } catch (e) {
      console.error('Failed to reload profile:', e);
    }
  },

  updateCollegeWeekdays: async (days: number[]) => {
    const current = get().profile;
    const updated: UserProfile = {
      ...current,
      collegeWeekdays: days,
      updatedAt: new Date().toISOString()
    };
    set({ profile: updated });
    const db = await getDb();
    await db.put('user_profile', updated);
  },

  updateTeachingBlock: async (startTime, endTime, enabled) => {
    const current = get().profile;
    const updated: UserProfile = {
      ...current,
      teachingBlock: { startTime, endTime, enabled },
      updatedAt: new Date().toISOString()
    };
    set({ profile: updated });
    const db = await getDb();
    await db.put('user_profile', updated);
  },

  updateGymBlock: async (startTime, endTime, enabled) => {
    const current = get().profile;
    const updated: UserProfile = {
      ...current,
      gymBlock: { startTime, endTime, enabled },
      updatedAt: new Date().toISOString()
    };
    set({ profile: updated });
    const db = await getDb();
    await db.put('user_profile', updated);
  },

  updateGroqApiKey: async (key: string) => {
    const current = get().profile;
    const updated: UserProfile = {
      ...current,
      groqApiKey: key.trim(),
      updatedAt: new Date().toISOString()
    };
    set({ profile: updated });
    const db = await getDb();
    await db.put('user_profile', updated);

    // Also update localStorage for immediate sync with groqClient
    if (typeof window !== 'undefined') {
      if (key.trim()) {
        localStorage.setItem('groq_api_key', key.trim());
      } else {
        localStorage.removeItem('groq_api_key');
      }
    }
  },

  updateDefaultFocusIntervalMinutes: async (minutes: number) => {
    const current = get().profile;
    const updated: UserProfile = {
      ...current,
      defaultFocusIntervalMinutes: minutes,
      updatedAt: new Date().toISOString()
    };
    set({ profile: updated });
    const db = await getDb();
    await db.put('user_profile', updated);
  },

  updateTheme: async (theme: 'dark' | 'light' | 'system') => {
    const current = get().profile;
    const updated: UserProfile = {
      ...current,
      theme,
      updatedAt: new Date().toISOString()
    };
    set({ profile: updated });
    const db = await getDb();
    await db.put('user_profile', updated);
  },

  updateReducedMotion: async (reduced: boolean) => {
    const current = get().profile;
    const updated: UserProfile = {
      ...current,
      reducedMotion: reduced,
      updatedAt: new Date().toISOString()
    };
    set({ profile: updated });
    const db = await getDb();
    await db.put('user_profile', updated);
  }
}));
