import type { ChartEngine } from "../core/chartEngine";

/**
 * Converts a horizontal pixel position within the chart
 * into the corresponding data index based on current zoom
 * (bar width) and viewport offset.
 */
export function _indexAtX(engine: ChartEngine, x: number): number {
  return Math.round((x - engine.barWidth / 2) / engine.barWidth) + engine.viewStart;
}
