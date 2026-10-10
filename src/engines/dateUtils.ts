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
 * Returns today's date bounded within the 90-day roadmap (2026-10-21 to 2027-01-20).
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
  return dateStr === getLocalCalendarDate();
}
