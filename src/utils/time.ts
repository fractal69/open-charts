const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type TimeGridStep =
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

/**
 * Converts a Unix timestamp (seconds) to a UTC Date.
 *
 * @param time Unix timestamp in seconds.
 * @returns UTC Date instance.
 */
export function _tsToDate(time: number): Date {
  return new Date(time * 1000);
}

/**
 * Formats a timestamp for the time axis.
 *
 * @param time Unix timestamp in seconds.
 * @param step Active grid step.
 * @returns Formatted axis label.
 */
export function _formatDate(
  time: number,
  step: TimeGridStep,
): string {
  const d = _tsToDate(time);

  const month = MONTHS[d.getUTCMonth()];
  const day = String(d.getUTCDate()).padStart(2, "0");
  const year = String(d.getUTCFullYear()).slice(2);
  const hour = String(d.getUTCHours()).padStart(2, "0");
  const minute = String(d.getUTCMinutes()).padStart(2, "0");

  switch (step) {
    case "minute":
      return `${hour}:${minute}`;

    case "hour":
      return `${hour}:00`;

    case "day":
    case "week":
      return `${month} ${day}`;

    case "month":
      return `${month} ${year}`;

    case "quarter":
      return `Q${Math.floor(d.getUTCMonth() / 3) + 1} ${year}`;

    case "year":
      return String(d.getUTCFullYear());
  }
}

/**
 * Formats a timestamp for the crosshair time label.
 *
 * Unlike the time-axis labels, this formatter returns a more
 * descriptive date and time so the user can identify the
 * exact bar under the cursor.
 *
 * @param time Unix timestamp in seconds.
 * @param interval Chart interval in seconds.
 * @returns Formatted date/time string.
 */
export function _formatDateFull(
  time: number,
  interval: number,
): string {
  const d = _tsToDate(time);

  const month = MONTHS[d.getUTCMonth()];
  const day = String(d.getUTCDate()).padStart(2, "0");
  const year = d.getUTCFullYear();

  const hour = String(d.getUTCHours()).padStart(2, "0");
  const minute = String(d.getUTCMinutes()).padStart(2, "0");
  const second = String(d.getUTCSeconds()).padStart(2, "0");

  const date = `${month} ${day}, ${year}`;

  // Sub-minute charts.
  if (interval < 60) {
    return `${date} ${hour}:${minute}:${second}`;
  }

  // Intraday charts.
  if (interval < 86400) {
    return `${date} ${hour}:${minute}`;
  }

  // Daily and higher.
  return date;
}