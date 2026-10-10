export const ROADMAP_START = '2026-10-21';
export const ROADMAP_END = '2027-01-20';

/**
 * Returns today's actual calendar date formatted as YYYY-MM-DD in the Asia/Kolkata timezone.
 */
export function getLocalCalendarDate(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
}

/**
 * Returns today's actual calendar date string formatted as YYYY-MM-DD.
 */
export function getTodayDateString(): string {
  return getLocalCalendarDate();
}

/**
 * Checks whether the given date string matches today's dynamic date.
 */
export function isTodayDate(dateStr: string): boolean {
  return dateStr === getLocalCalendarDate();
}
