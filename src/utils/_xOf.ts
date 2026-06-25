import type { ChartEngine } from "../core/chartEngine";

/**
 * Converts a data index into its corresponding X pixel coordinate
 * within the visible chart area.
 *
 * The returned coordinate represents the horizontal center of the
 * bar/candle, taking into account the current viewport position
 * (`viewStart`) and the active bar width (`barWidth`).
 *
 * @param this - Chart engine instance.
 * @param i - Data index of the bar to convert.
 * @returns X coordinate in canvas pixels.
 */
export function _xOf(this: ChartEngine, i: number): number {
  return (i - this.viewStart) * this.barWidth + this.barWidth / 2;
}
