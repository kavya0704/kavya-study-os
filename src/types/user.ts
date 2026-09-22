export type DayType = 'college' | 'non_college' | 'rest' | 'custom';

export interface TeachingBlockConfig {
  enabled: boolean;
  startTime: string; // '16:30'
  endTime: string;   // '18:00'
}

export interface GymBlockConfig {
  enabled: boolean;
  startTime: string; // '06:30'
  endTime: string;   // '07:45'
}

export interface UserProfile {
  id: string;
  displayName: string;
  timezone: string;
  planStartDate: string;
  collegeWeekdays: number[]; // [1, 3, 5] (Mon, Wed, Fri)
  teachingBlock: TeachingBlockConfig;
  gymBlock: GymBlockConfig;
  pujaRestDates: string[]; // ['2026-10-17', ..., '2026-10-21']
  theme: 'dark' | 'light' | 'system';
  reducedMotion: boolean;
  defaultFocusIntervalMinutes: number;
  groqApiKey?: string;
  createdAt: string;
  updatedAt: string;
}
