import { create } from 'zustand';
import { Note, ErrorLogEntry } from '../types';
import { getDb } from '../services/db';

interface NoteState {
  notes: Note[];
  allNotes: Note[];
  activeNote: Note | null;
  isSaving: boolean;
  loadNotesForTask: (taskId: string) => Promise<void>;
  loadAllNotes: () => Promise<void>;
  saveNote: (note: Partial<Note>) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  logError: (entry: Omit<ErrorLogEntry, 'id' | 'createdAt'>) => Promise<ErrorLogEntry>;
  searchNotes: (query: string) => Promise<Note[]>;
  loadReflectionForDate: (dateStr: string) => Promise<Note | null>;
  saveReflection: (
    dateStr: string,
    reflection: {
      understood: string;
      stuck: string;
      revise: string;
      tomorrowPriority: string;
    }
  ) => Promise<Note>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  allNotes: [],
  activeNote: null,
  isSaving: false,

  loadNotesForTask: async (taskId: string) => {
    const db = await getDb();
    const notes = await db.getAllFromIndex('notes', 'by_taskId', taskId);
    set({ notes, activeNote: notes[0] || null });
  },

  loadAllNotes: async () => {
    try {
      const db = await getDb();
      const all: Note[] = await db.getAll('notes');
      const sorted = all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      set({ allNotes: sorted });
    } catch (err) {
      console.error('Failed to load all notes:', err);
    }
  },

  saveNote: async (partial) => {
    set({ isSaving: true });
    const db = await getDb();
    
    const noteId = partial.id || `note-${Date.now()}`;
    const fullNote: Note = {
      id: noteId,
      type: partial.type || 'task_note',
      title: partial.title || 'Untitled Note',
      bodyMarkdown: partial.bodyMarkdown || '',
      taskId: partial.taskId,
      resourceIds: partial.resourceIds || [],
      tags: partial.tags || [],
      isPinned: partial.isPinned ?? false,
      createdAt: partial.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.put('notes', fullNote);
    const existing = get().notes.filter(n => n.id !== noteId);
    const updatedNotes = [fullNote, ...existing];
    set({ 
      notes: updatedNotes, 
      activeNote: fullNote, 
      isSaving: false 
    });
    await get().loadAllNotes();
    return fullNote;
  },

  deleteNote: async (id: string) => {
    const db = await getDb();
    await db.delete('notes', id);
    set({
      notes: get().notes.filter(n => n.id !== id),
      allNotes: get().allNotes.filter(n => n.id !== id),
      activeNote: get().activeNote?.id === id ? null : get().activeNote
    });
  },

  logError: async (entry) => {
    const db = await getDb();
    const errorLog: ErrorLogEntry = {
      id: `err-${Date.now()}`,
      ...entry,
      createdAt: new Date().toISOString()
    };

    // Save as a structured note tagged with #error_log
    const errorNote: Note = {
      id: `note-${errorLog.id}`,
      type: 'error_log',
      title: `Bug Diagnostic: ${entry.symptom.slice(0, 45)}`,
      bodyMarkdown: `### Symptom\n${entry.symptom}\n\n### Root Cause\n${entry.rootCause}\n\n### Code Fix\n\`\`\`python\n${entry.codeFix}\n\`\`\`\n\n### Interview Lesson\n${entry.lesson}`,
      taskId: entry.taskId,
      resourceIds: [],
      tags: ['#error_log', entry.topic || 'Python'],
      isPinned: true,
      createdAt: errorLog.createdAt,
      updatedAt: errorLog.createdAt
    };

    await db.put('notes', errorNote);
    await get().loadAllNotes();
    return errorLog;
  },

  searchNotes: async (query: string) => {
    const db = await getDb();
    const allNotes: Note[] = await db.getAll('notes');
    const lower = query.toLowerCase().trim();
    if (!lower) return allNotes;

    return allNotes.filter(n => 
      n.title.toLowerCase().includes(lower) || 
      n.bodyMarkdown.toLowerCase().includes(lower) ||
      n.tags.some(t => t.toLowerCase().includes(lower))
    );
  },

  loadReflectionForDate: async (dateStr: string) => {
    const db = await getDb();
    const reflectionId = `reflection-${dateStr}`;
    const found = await db.get('notes', reflectionId);
    return found || null;
  },

  saveReflection: async (dateStr, reflection) => {
    set({ isSaving: true });
    const db = await getDb();
    const reflectionId = `reflection-${dateStr}`;
    const now = new Date().toISOString();

    const markdownBody = `### 1. What did I understand?
${reflection.understood}

### 2. Where did I get stuck?
${reflection.stuck}

### 3. What should I revise?
${reflection.revise}

### 4. What is tomorrow's #1 priority?
${reflection.tomorrowPriority}`;

    const reflectionNote: Note = {
      id: reflectionId,
      type: 'daily_reflection',
      title: `Daily Reflection — ${dateStr}`,
      bodyMarkdown: markdownBody,
      resourceIds: [],
      tags: ['#daily_reflection', dateStr],
      isPinned: false,
      createdAt: now,
      updatedAt: now
    };

    await db.put('notes', reflectionNote);
    set({ isSaving: false });
    await get().loadAllNotes();
    return reflectionNote;
  }
}));
