import { create } from 'zustand';
import { StudyDay, StudyTask, StudyTaskSubtasks, TaskStatus } from '../types';
import { getDb, getStudyDayByDate, getTasksForDate } from '../services/db';
import { generateSpacedRevisionItems } from '../engines/spacedRevisionEngine';
import { validateReschedule } from '../engines/rescheduleEngine';
import { getTodayDateString } from '../engines';

interface UndoRecord {
  task: StudyTask;
  previousStatus: TaskStatus;
  timestamp: number;
}

interface TaskState {
  currentDate: string;
  currentDay: StudyDay | null;
  tasks: StudyTask[];
  isLoading: boolean;
  undoRecord: UndoRecord | null;
  
  loadDate: (dateStr: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<{ completed: boolean; subtasksMissing?: boolean }>;
  toggleSubtask: (taskId: string, subtaskKey: keyof StudyTaskSubtasks) => Promise<void>;
  executeUndo: () => Promise<void>;
  rescheduleTask: (taskId: string, newDateStr: string) => Promise<{ success: boolean; error?: string }>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  currentDate: getTodayDateString(),
  currentDay: null,
  tasks: [],
  isLoading: true,
  undoRecord: null,

  loadDate: async (dateStr: string) => {
    set({ isLoading: true, currentDate: dateStr });
    try {
      const day = await getStudyDayByDate(dateStr);
      const tasks = await getTasksForDate(dateStr);
      set({ 
        currentDay: day || null, 
        tasks: tasks.sort((a, b) => a.order - b.order),
        isLoading: false 
      });
    } catch (e) {
      console.error('Failed to load tasks for date:', e);
      set({ isLoading: false });
    }
  },

  toggleSubtask: async (taskId: string, subtaskKey: keyof StudyTaskSubtasks) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const updatedSubtasks: StudyTaskSubtasks = {
      ...task.subtasks,
      [subtaskKey]: !task.subtasks[subtaskKey]
    };

    const updatedTask: StudyTask = {
      ...task,
      subtasks: updatedSubtasks,
      updatedAt: new Date().toISOString()
    };

    set({ tasks: tasks.map(t => t.id === taskId ? updatedTask : t) });
    const db = await getDb();
    await db.put('study_tasks', updatedTask);
  },

  toggleTask: async (taskId: string) => {
    const { tasks, currentDate } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { completed: false };

    // Invariant: Backlog video tasks require all 6 subtasks checked
    if (task.category === 'masai_backlog' && task.status !== 'completed' && task.subtasks) {
      const sub = task.subtasks;
      const allDone = sub.watchedActively && sub.recreatedExample && sub.wroteRecallQuestions &&
                      sub.solvedVariations && sub.recordedDoubtOrMistake && sub.committedProof;
      if (!allDone) {
        return { completed: false, subtasksMissing: true };
      }
    }

    const previousStatus = task.status;
    const newStatus = previousStatus === 'completed' ? 'pending' : 'completed';

    const updatedTask: StudyTask = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };

    // Optimistic update
    set({
      tasks: tasks.map(t => t.id === taskId ? updatedTask : t),
      undoRecord: newStatus === 'completed' ? { task, previousStatus, timestamp: Date.now() } : null
    });

    const db = await getDb();
    await db.put('study_tasks', updatedTask);

    // Auto-generate spaced reviews if completed
    if (newStatus === 'completed') {
      const revItems = generateSpacedRevisionItems(updatedTask, currentDate);
      if (revItems.length > 0) {
        const revTx = db.transaction('revision_items', 'readwrite');
        for (const item of revItems) {
          await revTx.store.put(item);
        }
        await revTx.done;
      }
    }

    return { completed: newStatus === 'completed' };
  },

  executeUndo: async () => {
    const { undoRecord, tasks } = get();
    if (!undoRecord) return;

    const revertedTask: StudyTask = {
      ...undoRecord.task,
      status: undoRecord.previousStatus,
      completedAt: undefined,
      updatedAt: new Date().toISOString()
    };

    set({
      tasks: tasks.map(t => t.id === undoRecord.task.id ? revertedTask : t),
      undoRecord: null
    });

    const db = await getDb();
    await db.put('study_tasks', revertedTask);
  },

  rescheduleTask: async (taskId: string, newDateStr: string) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Task not found' };

    const targetDateTasks = await getTasksForDate(newDateStr);
    const validation = validateReschedule(task, newDateStr, targetDateTasks);

    if (!validation.allowed) {
      return { success: false, error: validation.reason };
    }

    const updatedTask: StudyTask = {
      ...task,
      currentDate: newDateStr,
      updatedAt: new Date().toISOString()
    };

    const db = await getDb();
    await db.put('study_tasks', updatedTask);

    // Refresh current date tasks
    await get().loadDate(get().currentDate);
    return { success: true };
  }
}));
