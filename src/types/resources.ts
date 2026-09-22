export type ResourceType = 'video' | 'documentation' | 'practice' | 'career' | 'tool';
export type ResourceLanguage = 'Hindi' | 'Hinglish' | 'English';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  category: string;
  topic: string;
  language: ResourceLanguage;
  provider: string;
  isPrimary: boolean;
  lastVerifiedDate: string;
  isFavourite: boolean;
  useCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RevisionItem {
  id: string;
  sourceTaskId: string;
  topic: string;
  dueDate: string;
  stage: 'day_1' | 'day_3' | 'day_7' | 'weekly_review';
  actionPrompt: string;
  status: 'pending' | 'completed' | 'rescheduled';
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationRecord {
  id: string;
  company: string;
  role: string;
  url: string;
  dateApplied: string;
  status: 'draft' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'archived';
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
