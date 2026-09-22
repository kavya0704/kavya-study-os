import { create } from 'zustand';
import { Resource } from '../types';
import { getDb } from '../services/db';
import resourcesSeed from '../data/seeds/resources.json';

interface ResourceState {
  resources: Resource[];
  isLoading: boolean;
  searchQuery: string;
  selectedSegment: 'all' | 'video' | 'documentation' | 'practice' | 'career' | 'saved';
  selectedLanguage: 'All' | 'Hindi' | 'Hinglish' | 'English';
  onlyPrimary: boolean;

  // Actions
  loadResources: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedSegment: (segment: 'all' | 'video' | 'documentation' | 'practice' | 'career' | 'saved') => void;
  setSelectedLanguage: (lang: 'All' | 'Hindi' | 'Hinglish' | 'English') => void;
  setOnlyPrimary: (only: boolean) => void;
  toggleFavorite: (resourceId: string) => Promise<void>;
  updateResourceUrl: (resourceId: string, newUrl: string) => Promise<void>;
  incrementUseCount: (resourceId: string) => Promise<void>;
  addCustomResource: (res: {
    title: string;
    url: string;
    type: 'video' | 'documentation' | 'practice' | 'career' | 'tool';
    category: string;
    topic: string;
    language: 'Hindi' | 'Hinglish' | 'English';
    provider: string;
  }) => Promise<Resource>;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: [],
  isLoading: false,
  searchQuery: '',
  selectedSegment: 'all',
  selectedLanguage: 'All',
  onlyPrimary: false,

  loadResources: async () => {
    set({ isLoading: true });
    const db = await getDb();
    let all: Resource[] = await db.getAll('resources');

    // If database was empty, fallback to seed
    if (!all || all.length === 0) {
      all = resourcesSeed as unknown as Resource[];
      const tx = db.transaction('resources', 'readwrite');
      for (const r of all) {
        await tx.store.put(r);
      }
      await tx.done;
    }

    set({ resources: all, isLoading: false });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedSegment: (segment) => set({ selectedSegment: segment }),
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  setOnlyPrimary: (only) => set({ onlyPrimary: only }),

  toggleFavorite: async (resourceId: string) => {
    const { resources } = get();
    const item = resources.find(r => r.id === resourceId);
    if (!item) return;

    const updated: Resource = {
      ...item,
      isFavourite: !item.isFavourite,
      updatedAt: new Date().toISOString()
    };

    set({
      resources: resources.map(r => r.id === resourceId ? updated : r)
    });

    const db = await getDb();
    await db.put('resources', updated);
  },

  updateResourceUrl: async (resourceId: string, newUrl: string) => {
    const { resources } = get();
    const item = resources.find(r => r.id === resourceId);
    if (!item) return;

    const updated: Resource = {
      ...item,
      url: newUrl.trim(),
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    set({
      resources: resources.map(r => r.id === resourceId ? updated : r)
    });

    const db = await getDb();
    await db.put('resources', updated);
  },

  incrementUseCount: async (resourceId: string) => {
    const { resources } = get();
    const item = resources.find(r => r.id === resourceId);
    if (!item) return;

    const updated: Resource = {
      ...item,
      useCount: (item.useCount || 0) + 1,
      updatedAt: new Date().toISOString()
    };

    set({
      resources: resources.map(r => r.id === resourceId ? updated : r)
    });

    const db = await getDb();
    await db.put('resources', updated);
  },

  addCustomResource: async (newRes) => {
    const now = new Date().toISOString();
    const created: Resource = {
      ...newRes,
      id: `custom-res-${Date.now()}`,
      isPrimary: false,
      lastVerifiedDate: now.split('T')[0],
      isFavourite: true, // Auto-favorite custom links
      useCount: 0,
      createdAt: now,
      updatedAt: now
    };

    const { resources } = get();
    set({ resources: [created, ...resources] });

    const db = await getDb();
    await db.put('resources', created);
    return created;
  }
}));
