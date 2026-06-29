import type { ChartEngine } from "../core/chartEngine";

/**
 * Determines whether the specified bar should display
 * a vertical time grid line.
 *
 * A grid line is rendered whenever the selected time unit
 * changes relative to the previous bar.
 *
 * @param engine Chart engine instance.
 * @param i Bar index.
 * @param step Active grid unit.
 * @returns True if a grid line should be rendered.
 */
export function _isTimeGridLine(
  engine: ChartEngine,
  i: number,
  step: string,
): boolean {
  if (i <= 0 || i >= engine.data.length) {
    return false;
  }

  const data: any[] = engine.data;

  const t = data[i].time;
  const t0 = data[i - 1].time;

  switch (step) {
    case "minute":
      return Math.floor(t / 60) !== Math.floor(t0 / 60);

    case "hour":
      return Math.floor(t / 3600) !== Math.floor(t0 / 3600);

    case "day":
      return Math.floor(t / 86400) !== Math.floor(t0 / 86400);

    case "week": {
      const d = new Date(t * 1000);
      const d0 = new Date(t0 * 1000);

      // Draw a grid line at the beginning of each UTC week (Monday).
      return d.getUTCDay() === 1 && d0.getUTCDay() !== 1;
    }

    case "month": {
      const d = new Date(t * 1000);
      const d0 = new Date(t0 * 1000);

      return (
        d.getUTCFullYear() !== d0.getUTCFullYear() ||
        d.getUTCMonth() !== d0.getUTCMonth()
      );
    }

    case "quarter": {
      const d = new Date(t * 1000);
      const d0 = new Date(t0 * 1000);

      return (
        d.getUTCFullYear() !== d0.getUTCFullYear() ||
        Math.floor(d.getUTCMonth() / 3) !==
          Math.floor(d0.getUTCMonth() / 3)
      );
    }

    case "year": {
      const d = new Date(t * 1000);
      const d0 = new Date(t0 * 1000);

      return d.getUTCFullYear() !== d0.getUTCFullYear();
    }

    default:
      return false;
  }
}