import type { ChartEngine } from "../core/chartEngine";

/**
 * Converts a horizontal pixel position within the chart
 * into the corresponding data index based on current zoom
 * (bar width) and viewport offset.
 */
export function _indexAtX(this: ChartEngine, x: number): number {
  return Math.round((x - this.barWidth / 2) / this.barWidth) + this.viewStart;
}
