import { StudyTask } from '../types';
import { DEFAULT_PUJA_DATES } from './spacedRevisionEngine';

export interface RescheduleValidation {
  allowed: boolean;
  reason?: string;
  impactMessage?: string;
}

export function validateReschedule(
  task: StudyTask,
  targetDateStr: string,
  existingTasksOnTargetDate: StudyTask[],
  pujaDates: string[] = DEFAULT_PUJA_DATES
): RescheduleValidation {
  // Invariant 1: Cannot reschedule onto protected Durga Puja rest days
  if (pujaDates.includes(targetDateStr)) {
    return {
      allowed: false,
      reason: '17–21 October is the protected Durga Puja festival break. Zero study is required and rescheduling onto rest days is blocked to protect recovery.'
    };
  }

  // Invariant 2: Cannot place two Masai backlog videos on the same day
  if (task.category === 'masai_backlog') {
    const hasBacklogAlready = existingTasksOnTargetDate.some(
      t => t.category === 'masai_backlog' && t.id !== task.id
    );
    if (hasBacklogAlready) {
      return {
        allowed: false,
        reason: 'Strict 1 backlog video per day rule: The target date already contains a scheduled backlog video. Double-video days are prohibited to avoid burn-out.'
      };
    }
  }

  // Valid reschedule
  return {
    allowed: true,
    impactMessage: `Task will move from ${task.currentDate} to ${targetDateStr}. Prior review schedules will adjust automatically.`
  };
}

export function getRecommendedBufferDate(currentDateStr: string): string {
  // Nearest designated buffer is 2026-10-28 (Day 37) or following Sunday
  if (currentDateStr < '2026-10-28') {
    return '2026-10-28';
  }
  // Return next Sunday
  const d = new Date(currentDateStr);
  const dayOfWeek = d.getDay(); // 0 = Sunday
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSunday);
  return d.toISOString().split('T')[0];
}
