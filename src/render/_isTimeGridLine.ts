import type { ChartEngine } from "../core/ChartEngine";

/**
 * Determines whether the specified bar starts a new time grid interval.
 *
 * @param engine Chart engine instance.
 * @param index Data index to evaluate.
 * @param step Grid interval.
 * @returns True if a vertical grid line should be drawn.
 */
export function _isTimeGridLine(
  engine: ChartEngine,
  index: number,
  step: string,
): boolean {
  if (index <= 0) {
    return false;
  }

  const current = engine.utils.timeOf(index);
  const previous = engine.utils.timeOf(index - 1);

  switch (step) {
    case "minute":
      return Math.floor(current / 60) !== Math.floor(previous / 60);

    case "hour":
      return Math.floor(current / 3600) !== Math.floor(previous / 3600);

    case "day":
      return Math.floor(current / 86400) !== Math.floor(previous / 86400);

    case "week":
      return (
        Math.floor((current + 3 * 86400) / (7 * 86400)) !==
        Math.floor((previous + 3 * 86400) / (7 * 86400))
      );

    default: {
      const c = new Date(current * 1000);
      const p = new Date(previous * 1000);

      switch (step) {
        case "month":
          return (
            c.getUTCFullYear() !== p.getUTCFullYear() ||
            c.getUTCMonth() !== p.getUTCMonth()
          );

        case "quarter":
          return (
            c.getUTCFullYear() !== p.getUTCFullYear() ||
            Math.floor(c.getUTCMonth() / 3) !==
              Math.floor(p.getUTCMonth() / 3)
          );

        case "year":
          return c.getUTCFullYear() !== p.getUTCFullYear();

        default:
          return false;
      }
    }
  }
}