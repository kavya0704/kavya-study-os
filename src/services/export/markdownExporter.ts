import { getDb } from '../db/db';
import { Note, StudyTask } from '../../types';

/**
 * Consolidates all study notes, reflections, and error logs into a structured Markdown document
 * and initiates a browser download.
 */
export async function exportStudyNotesMarkdown(): Promise<{ markdown: string; notesCount: number }> {
  const db = await getDb();

  const notes = await db.getAll('notes') as Note[];
  const tasks = await db.getAll('study_tasks') as StudyTask[];

  const taskMap = new Map<string, StudyTask>();
  for (const t of tasks) {
    taskMap.set(t.id, t);
  }

  const reflections = notes.filter(n => n.type === 'daily_reflection');
  const errorLogs = notes.filter(n => n.type === 'doubt' || n.type === 'error_log' || (n.bodyMarkdown && n.bodyMarkdown.includes('#error_log')) || (n.tags && n.tags.includes('error_log')));
  const lessonNotes = notes.filter(n => (n.type === 'task_note' || n.type === 'topic_note') && !(n.bodyMarkdown && n.bodyMarkdown.includes('#error_log')));

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const lines: string[] = [];

  // Header
  lines.push('# Kavya StudyOS — Engineering Study Archive');
  lines.push(`> **Generated:** ${dateFormatted} | **Total Records:** ${notes.length}`);
  lines.push(`> **Roadmap:** 101-Day Machine Learning & AI Engineering (22 Sep – 31 Dec 2026)`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push(`1. [Daily Reflection Journals (${reflections.length})](#1-daily-reflection-journals)`);
  lines.push(`2. [Technical Error Logs & Debugging Records (${errorLogs.length})](#2-technical-error-logs--debugging-records)`);
  lines.push(`3. [Lesson & Concept Notes (${lessonNotes.length})](#3-lesson--concept-notes)`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Section 1: Reflections
  lines.push('## 1. Daily Reflection Journals');
  if (reflections.length === 0) {
    lines.push('_No daily reflection journals recorded yet._');
  } else {
    reflections.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    for (const ref of reflections) {
      lines.push(`### Reflection — ${ref.createdAt.slice(0, 10)}`);
      lines.push(`*Last modified: ${ref.updatedAt}*`);
      lines.push('');
      lines.push(ref.bodyMarkdown || '');
      lines.push('');
      lines.push('---');
    }
  }
  lines.push('');

  // Section 2: Error Logs
  lines.push('## 2. Technical Error Logs & Debugging Records');
  if (errorLogs.length === 0) {
    lines.push('_No error logs or debugging records saved yet. Any mistakes tagged with `#error_log` will appear here._');
  } else {
    errorLogs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    for (const err of errorLogs) {
      const task = err.taskId ? taskMap.get(err.taskId) : null;
      lines.push(`### Error Record: ${task ? task.title : (err.title || 'General System Note')}`);
      if (task) {
        lines.push(`- **Category:** \`${task.category}\` | **Date:** \`${task.currentDate}\``);
        if (task.backlogVideoNumber) {
          lines.push(`- **Masai Backlog Lesson:** #${task.backlogVideoNumber}`);
        }
      }
      lines.push(`- **Logged:** ${err.createdAt}`);
      lines.push('');
      lines.push('```');
      lines.push(err.bodyMarkdown || '');
      lines.push('```');
      lines.push('');
      lines.push('---');
    }
  }
  lines.push('');

  // Section 3: Lesson & Concept Notes
  lines.push('## 3. Lesson & Concept Notes');
  if (lessonNotes.length === 0) {
    lines.push('_No lesson notes recorded yet._');
  } else {
    lessonNotes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    for (const item of lessonNotes) {
      const task = item.taskId ? taskMap.get(item.taskId) : null;
      lines.push(`### ${task ? task.title : (item.title || 'Study Note')}`);
      if (task) {
        lines.push(`- **Module:** \`${task.category}\` | **Scheduled Date:** \`${task.currentDate}\``);
        if (task.proofUrl) {
          lines.push(`- **GitHub Proof:** [${task.proofUrl}](${task.proofUrl})`);
        }
      }
      const tagList = item.tags && item.tags.length > 0 ? item.tags.map((t: string) => `\`#${t}\``).join(' ') : '_None_';
      lines.push(`- **Tags:** ${tagList}`);
      lines.push('');
      lines.push(item.bodyMarkdown || '');
      lines.push('');
      lines.push('---');
    }
  }

  const markdown = lines.join('\n');
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `kavya_studyos_notes_${dateStr}.md`;

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return { markdown, notesCount: notes.length };
}
