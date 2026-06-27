import type { ChartEngine } from "./chartEngine";

/**
 * Keeps the chart viewport within valid data limits and
 * recalculates the visible range according to the current
 * zoom level and available chart width.
 */
export function _clampView(engine: ChartEngine) {
  // Exit if no data is available.
  if (!engine.hasData) return;

  // Calculate how many bars fit within the current chart width.
  const capacity = Math.floor(engine.chartW / engine.barWidth);

  // Determine the maximum allowed end index, including right padding.
  const maxViewEnd = engine.data.length + engine.rightPadBars;

  // Clamp the viewport end index to the valid range.
  engine.viewEnd = Math.min(Math.max(engine.viewEnd, 1), maxViewEnd);

  // Recalculate the viewport start index based on chart capacity.
  engine.viewStart = Math.max(0, engine.viewEnd - capacity);
}
