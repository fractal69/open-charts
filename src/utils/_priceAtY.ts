import type { ChartPane } from "../core/types";

/**
 * Converts a Y coordinate into its corresponding price.
 *
 * This is the inverse operation of `_yOf()` and is used to determine
 * the price under the mouse cursor.
 *
 * @param y Y coordinate relative to the pane.
 * @param pane Target chart pane.
 * @param priceMin Lowest visible price.
 * @param priceMax Highest visible price.
 * @returns Price corresponding to the specified Y coordinate.
 */
export function _priceAtY(
  y: number,
  pane: ChartPane,
  priceMin: number,
  priceMax: number,
): number {
  // Prevent division by zero.
  const range = priceMax - priceMin || 1;

  // Invert the transformation performed by _yOf().
  return (
    priceMin +
    ((pane.h - pane.h * 0.04 - y) / (pane.h * 0.92)) * range
  );
}