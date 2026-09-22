import { create } from 'zustand';
import { RevisionItem, StudyTask } from '../types';
import { getDb } from '../services/db';
import { generateSpacedRevisionItems, adjustForRestAndHolidays, addDays } from '../engines/spacedRevisionEngine';

interface RevisionState {
  items: RevisionItem[];
  isLoading: boolean;
  loadRevisionItems: () => Promise<void>;
  gradeRevisionItem: (itemId: string, grade: 'strong' | 'needs_review' | 'blocked') => Promise<void>;
  createRevisionItemsForTask: (task: StudyTask, completionDate: string) => Promise<RevisionItem[]>;
}

export const useRevisionStore = create<RevisionState>((set, get) => ({
  items: [],
  isLoading: true,

  loadRevisionItems: async () => {
    set({ isLoading: true });
    try {
      const db = await getDb();
      const allItems: RevisionItem[] = await db.getAll('revision_items');
      set({
        items: allItems.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
        isLoading: false
      });
    } catch (err) {
      console.error('Failed to load revision items:', err);
      set({ isLoading: false });
    }
  },

  gradeRevisionItem: async (itemId: string, grade: 'strong' | 'needs_review' | 'blocked') => {
    const { items } = get();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const db = await getDb();
    const now = new Date().toISOString();

    if (grade === 'strong') {
      // Marked complete
      const updatedItem: RevisionItem = {
        ...item,
        status: 'completed',
        completedAt: now,
        updatedAt: now
      };
      await db.put('revision_items', updatedItem);
      set({ items: items.map(i => i.id === itemId ? updatedItem : i) });
    } else if (grade === 'needs_review') {
      // Re-schedule by +1 day (bumping past Durga Puja if needed)
      const nextDate = adjustForRestAndHolidays(addDays(item.dueDate, 1));
      const updatedItem: RevisionItem = {
        ...item,
        dueDate: nextDate,
        status: 'rescheduled',
        actionPrompt: `[Re-drill] ${item.actionPrompt}`,
        updatedAt: now
      };
      await db.put('revision_items', updatedItem);
      set({ items: items.map(i => i.id === itemId ? updatedItem : i) });
    } else if (grade === 'blocked') {
      // Keep pending and log error record to error tracker
      await db.put('notes', {
        id: `doubt-${Date.now()}`,
        taskId: item.sourceTaskId,
        title: `Revision Blocked: ${item.topic}`,
        content: `Blocked during ${item.stage} revision. Review needed for: ${item.actionPrompt}`,
        type: 'doubt',
        createdAt: now,
        updatedAt: now
      });

      // Shift by +2 days for recovery
      const nextDate = adjustForRestAndHolidays(addDays(item.dueDate, 2));
      const updatedItem: RevisionItem = {
        ...item,
        dueDate: nextDate,
        status: 'rescheduled',
        updatedAt: now
      };
      await db.put('revision_items', updatedItem);
      set({ items: items.map(i => i.id === itemId ? updatedItem : i) });
    }
  },

  createRevisionItemsForTask: async (task: StudyTask, completionDate: string) => {
    const newItems = generateSpacedRevisionItems(task, completionDate);
    if (newItems.length === 0) return [];

    const db = await getDb();
    const tx = db.transaction('revision_items', 'readwrite');
    for (const item of newItems) {
      await tx.store.put(item);
    }
    await tx.done;

    await get().loadRevisionItems();
    return newItems;
  }
}));
