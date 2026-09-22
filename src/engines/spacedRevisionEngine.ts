import { StudyTask, RevisionItem } from '../types';

export const DEFAULT_PUJA_DATES = [
  '2026-10-17',
  '2026-10-18',
  '2026-10-19',
  '2026-10-20',
  '2026-10-21'
];

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function adjustForRestAndHolidays(
  targetDateStr: string,
  pujaDates: string[] = DEFAULT_PUJA_DATES,
  dailyReviewCounts: Record<string, number> = {}
): string {
  let adjustedDate = targetDateStr;

  // Invariant 1: If falls on Durga Puja, bump past Puja to 2026-10-22
  while (pujaDates.includes(adjustedDate)) {
    adjustedDate = addDays(adjustedDate, 1);
  }

  // Invariant 2: Cap at maximum 2 required review tasks per day
  while ((dailyReviewCounts[adjustedDate] || 0) >= 2) {
    adjustedDate = addDays(adjustedDate, 1);
    while (pujaDates.includes(adjustedDate)) {
      adjustedDate = addDays(adjustedDate, 1);
    }
  }

  return adjustedDate;
}

export function generateSpacedRevisionItems(
  task: StudyTask,
  completionDateStr: string,
  pujaDates: string[] = DEFAULT_PUJA_DATES,
  dailyReviewCounts: Record<string, number> = {}
): RevisionItem[] {
  // Only learning, backlog, and practice tasks generate spaced reviews
  const eligibleCategories = ['masai_backlog', 'python_practice', 'ml_theory', 'project'];
  if (!eligibleCategories.includes(task.category)) {
    return [];
  }

  const items: RevisionItem[] = [];

  // 1. Day +1 (+24 Hours): 10-Minute Closed-Book Recall
  const rawDay1 = addDays(completionDateStr, 1);
  const dueDay1 = adjustForRestAndHolidays(rawDay1, pujaDates, dailyReviewCounts);
  dailyReviewCounts[dueDay1] = (dailyReviewCounts[dueDay1] || 0) + 1;

  items.push({
    id: `rev-${task.id}-d1`,
    sourceTaskId: task.id,
    topic: task.topic,
    dueDate: dueDay1,
    stage: 'day_1',
    actionPrompt: `Answer 5 closed-book recall questions on: ${task.topic}. Test mechanics and edge-cases before viewing notes.`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // 2. Day +3 (+72 Hours): Transfer Problem
  const rawDay3 = addDays(completionDateStr, 3);
  const dueDay3 = adjustForRestAndHolidays(rawDay3, pujaDates, dailyReviewCounts);
  dailyReviewCounts[dueDay3] = (dailyReviewCounts[dueDay3] || 0) + 1;

  items.push({
    id: `rev-${task.id}-d3`,
    sourceTaskId: task.id,
    topic: task.topic,
    dueDate: dueDay3,
    stage: 'day_3',
    actionPrompt: `Solve 1 transfer challenge with changed inputs or a fresh dataset for: ${task.topic}.`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // 3. Day +7 (+168 Hours): Closed-Book Oral / Quiz Defense
  const rawDay7 = addDays(completionDateStr, 7);
  const dueDay7 = adjustForRestAndHolidays(rawDay7, pujaDates, dailyReviewCounts);
  dailyReviewCounts[dueDay7] = (dailyReviewCounts[dueDay7] || 0) + 1;

  items.push({
    id: `rev-${task.id}-d7`,
    sourceTaskId: task.id,
    topic: task.topic,
    dueDate: dueDay7,
    stage: 'day_7',
    actionPrompt: `Take a 20-minute closed-book quiz and explain ${task.topic} aloud (What, Why, When, and 1 Common Bug).`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return items;
}
