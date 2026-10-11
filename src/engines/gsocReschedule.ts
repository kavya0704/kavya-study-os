import { GsocDay, CivilDate, GsocSettings } from '../types/gsoc';
import { addCivilDays, kolkataToday } from './gsocDateUtils';

export interface RescheduleProposalItem {
  dayId: string;
  originalDate: CivilDate;
  proposedDate: CivilDate;
  title: string;
  coreMinutes: number;
}

export interface ReschedulePlan {
  items: RescheduleProposalItem[];
  daysPushed: number;
  conflictsWithOfficialEvents: boolean;
}

/**
 * Computes a preview of shifting incomplete target days forward from today's date.
 * Preserves completed days and their historical dates strictly.
 */
export function previewCatchUpPlan(
  days: GsocDay[],
  completedDayIds: Set<string>,
  _settings?: GsocSettings,
  todayStr: CivilDate = kolkataToday()
): ReschedulePlan {
  const items: RescheduleProposalItem[] = [];

  // Find missed past days that are incomplete
  const overdueIncomplete = days
    .filter(d => d.targetDate < todayStr && !completedDayIds.has(d.id))
    .sort((a, b) => a.targetDate.localeCompare(b.targetDate));

  if (overdueIncomplete.length === 0) {
    return { items: [], daysPushed: 0, conflictsWithOfficialEvents: false };
  }

  // Calculate shift offset needed
  let cursorDate = todayStr;

  overdueIncomplete.forEach((day) => {
    // Propose moving each overdue day starting from today onward
    const proposedDate = cursorDate;
    items.push({
      dayId: day.id,
      originalDate: day.targetDate,
      proposedDate,
      title: day.title,
      coreMinutes: day.coreMinutes
    });

    cursorDate = addCivilDays(cursorDate, 1);
  });

  return {
    items,
    daysPushed: items.length,
    conflictsWithOfficialEvents: false
  };
}
