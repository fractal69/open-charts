import type { ChartEngine } from "../core/chartEngine";

/**
 * Scrolls the viewport to the latest available bar.
 *
 * The latest candle is positioned using the configured right-side
 * padding so new incoming bars remain visible.
 *
 * @param engine Chart engine instance.
 */
export function _scrollToRealTime(engine: ChartEngine): void {
  if (!engine.hasData) {
    return;
  }

  const capacity = Math.max(
    1,
    Math.floor(engine.chartW / engine.barWidth),
  );

  const logicalBars =
    engine.data.length + engine.rightPadBars;

  engine.viewEnd = logicalBars;
  engine.viewStart = Math.max(
    0,
    logicalBars - capacity,
  );

  engine.timeScale.clampView();

  engine.timeScale.updateScrollThumb();

  engine.dirty = true;
  engine.overlayDirty = true;
  engine.timeAxisDirty = true;
}