export const ROADMAP_START = '2026-09-22';
export const ROADMAP_END = '2026-12-31';

/**
 * Returns today's actual calendar date formatted as YYYY-MM-DD in the user's local timezone.
 */
export function getLocalCalendarDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date bounded within the 101-day roadmap (2026-09-22 to 2026-12-31).
 * If today is before the roadmap start, returns ROADMAP_START.
 * If today is after the roadmap end, returns ROADMAP_END.
 * Otherwise returns today's actual date string.
 */
export function getTodayDateString(): string {
  const localToday = getLocalCalendarDate();
  if (localToday < ROADMAP_START) {
    return ROADMAP_START;
  }
  if (localToday > ROADMAP_END) {
    return ROADMAP_END;
  }
  return localToday;
}

/**
 * Checks whether the given date string matches today's dynamic date.
 */
export function isTodayDate(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}
