import type { ChartEngine } from "../core/ChartEngine";

/**
 * Returns the number of bars between adjacent time labels.
 *
 * The spacing is derived from the current bar width so labels
 * remain approximately the same distance apart in screen pixels
 * across all zoom levels.
 *
 * @param engine Chart engine instance.
 */
export function _timeGridBars(engine: ChartEngine): number {
  // Desired spacing between labels in screen pixels.
  const targetPixels = 90;

  return Math.max(
    1,
    Math.round(targetPixels / engine.barWidth),
  );
}