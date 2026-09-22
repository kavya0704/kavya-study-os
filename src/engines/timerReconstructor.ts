export function calculateTrueElapsedSeconds(
  startTimestamp: number,
  pausedDurationMs: number,
  currentTimestamp: number = Date.now()
): number {
  if (startTimestamp <= 0) return 0;
  const rawElapsedMs = currentTimestamp - startTimestamp - pausedDurationMs;
  return Math.max(0, Math.floor(rawElapsedMs / 1000));
}

export function formatSecondsToDisplay(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}
