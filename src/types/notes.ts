export type NoteType = 'daily_reflection' | 'task_note' | 'topic_note' | 'doubt' | 'error_log';

export interface Note {
  id: string;
  type: NoteType;
  title: string;
  bodyMarkdown: string;
  taskId?: string;
  resourceIds: string[];
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorLogEntry {
  id: string;
  taskId?: string;
  symptom: string;
  rootCause: string;
  codeFix: string;
  lesson: string;
  topic: string;
  createdAt: string;
}
