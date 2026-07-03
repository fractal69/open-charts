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
const fmtMinute = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const fmtHour = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const fmtDay = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  timeZone: "UTC",
});

const fmtMonthDay = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const fmtMonth = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

const fmtYear = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  timeZone: "UTC",
});

export function _formatDate(
  currentTime: number,
  previousTime: number,
  step: TimeGridStep,
): string {
  const current = _tsToDate(currentTime);
  const previous = _tsToDate(previousTime);

  switch (step) {
    case "minute":
      return fmtMinute.format(current);

    case "hour": {
      const dayChanged =
        current.getUTCDate() !== previous.getUTCDate() ||
        current.getUTCMonth() !== previous.getUTCMonth() ||
        current.getUTCFullYear() !== previous.getUTCFullYear();

      return dayChanged
        ? fmtMonthDay.format(current)
        : `${fmtHour.format(current)}:00`;
    }

    case "day":
    case "week": {
      const monthChanged =
        current.getUTCMonth() !== previous.getUTCMonth() ||
        current.getUTCFullYear() !== previous.getUTCFullYear();

      return monthChanged
        ? fmtMonthDay.format(current)
        : fmtDay.format(current);
    }

    case "month":
      return fmtMonth.format(current);

    case "quarter":
      return `Q${Math.floor(current.getUTCMonth() / 3) + 1} ${String(
        current.getUTCFullYear(),
      ).slice(2)}`;

    case "year":
      return fmtYear.format(current);
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
export function _formatDateFull(time: number, interval: number): string {
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
