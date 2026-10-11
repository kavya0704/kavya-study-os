import { CivilDate } from '../types/gsoc';

const DAY_MS = 86_400_000;
export const GSOC_START_DATE: CivilDate = '2026-10-21';
export const GSOC_END_DATE: CivilDate = '2027-05-31';

/**
 * Validates and shifts a YYYY-MM-DD civil date by an integer amount of days using UTC arithmetic.
 */
export function addCivilDays(date: string, amount: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match || !Number.isInteger(amount)) {
    throw new Error(`Invalid civil date format (${date}) or offset (${amount})`);
  }
  const [, y, m, d] = match;
  const base = Date.UTC(Number(y), Number(m) - 1, Number(d));
  if (new Date(base).toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid calendar date: ${date}`);
  }
  return new Date(base + amount * DAY_MS).toISOString().slice(0, 10);
}

/**
 * Returns today's calendar date in Asia/Kolkata timezone as YYYY-MM-DD.
 */
export function kolkataToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(now);
  const value = (type: string) => parts.find(p => p.type === type)!.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

/**
 * Checks if the current or given IST date is strictly before the GSoC start date (2026-10-21).
 */
export function isBeforeGsocStart(dateStr: string = kolkataToday()): boolean {
  return dateStr < GSOC_START_DATE;
}

/**
 * Calculates remaining days until the 2026-10-21 start date.
 */
export function daysUntilGsocStart(nowDateStr: string = kolkataToday()): number {
  if (nowDateStr >= GSOC_START_DATE) return 0;
  const startUtc = new Date(`${GSOC_START_DATE}T00:00:00Z`).getTime();
  const curUtc = new Date(`${nowDateStr}T00:00:00Z`).getTime();
  return Math.ceil((startUtc - curUtc) / DAY_MS);
}

/**
 * Formats a YYYY-MM-DD date into friendly readable form: "Wed, Oct 21, 2026".
 */
export function formatGsocDate(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T00:00:00Z`);
    return d.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generates canonical daily target records from 32 weekly curriculum definitions.
 * Week 1 to 31 have 7 slots (A=0 ... G=6), Week 32 has 6 slots (A=0 ... F=5).
 * Total generated targets = 31 * 7 + 6 = 223 days.
 */
export function generateTargets<T extends { slots: Array<{ slotLetter: string }> }>(
  weeks: Array<T & { number: number }>,
  startDate: CivilDate = GSOC_START_DATE
): Array<{
  id: string;
  targetDate: CivilDate;
  weekNumber: number;
  slotIndex: number;
  slotLetter: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
  slotData: T['slots'][number];
}> {
  return weeks.flatMap(week =>
    week.slots.map((slot, offset) => {
      const slotLetter = 'abcdefg'[offset] as 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
      const dayOffset = (week.number - 1) * 7 + offset;
      const targetDate = addCivilDays(startDate, dayOffset);
      const weekStr = String(week.number).padStart(2, '0');
      return {
        id: `gsoc-w${weekStr}-${slotLetter}`,
        targetDate,
        weekNumber: week.number,
        slotIndex: offset,
        slotLetter,
        slotData: slot
      };
    })
  );
}
