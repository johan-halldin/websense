/**
 * Formats a Date as a short locale clock time, e.g. "1:42:07 PM".
 *
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  return date.toLocaleTimeString();
}

/**
 * Formats how long ago `date` was, relative to `now`, as a short human
 * string (e.g. "just now", "12s ago", "5m ago", "3h ago", "2d ago").
 *
 * @param {Date} date
 * @param {Date} [now] - defaults to the current time; pass explicitly to
 *   keep this pure/testable.
 * @returns {string}
 */
function formatRelativeTime(date, now = new Date()) {
  const seconds = Math.max(
    0,
    Math.round((now.getTime() - date.getTime()) / 1000),
  );

  if (seconds < 5) {
    return "just now";
  }
  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export { formatTime, formatRelativeTime };
