import type { ChartEngine } from "../core/ChartEngine";

/**
 * Clamps the current viewport to a valid visible range.
 *
 * This function should be called whenever the viewport may become
 * invalid, such as after panning, zooming, resizing the chart,
 * or modifying the visible range.
 *
 * The function preserves the current viewport position whenever
 * possible while ensuring that:
 *
 * - `viewEnd` never moves outside the available data range.
 * - The visible capacity matches the current chart width and bar width.
 * - `viewStart` is recomputed from the clamped `viewEnd`.
 *
 * Unlike `_resetViewport()`, this function does not choose a new
 * viewport location. It only corrects an existing viewport so that
 * it remains valid.
 *
 * @param engine Chart engine instance.
 */
export function _clampView(engine: ChartEngine): void {
  if (!engine.hasData) {
    return;
  }

  const capacity = Math.max(
    1,
    Math.floor(engine.chartW / engine.barWidth),
  );

  // Nunca permitir que el inicio sea negativo.
  engine.viewStart = Math.max(0, engine.viewStart);

  // El final siempre se deriva del inicio.
  engine.viewEnd = engine.viewStart + capacity;
}