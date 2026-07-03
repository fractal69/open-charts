import { _clampView } from "../../timeScale/_clampView";
import { _resetViewport } from "../../timeScale/_resetViewport";
import type { ChartEngine } from "../../core/chartEngine";
import { _updateScrollThumb } from "../_updateScrollThumb";
import { _scrollToRealTime } from "../_scrollToRealTime";

/**
 * Utils API exposed by the chart engine.
 */
export class ChartTimeScale {
  constructor(private readonly engine: ChartEngine) {}

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
   */
  public clampView(): void {
    _clampView(this.engine);
  }

  /**
   * Resets the viewport to the default position.
   *
   * This function is typically called after loading a new dataset or
   * whenever the chart should display the most recent bars.
   *
   * The viewport is positioned at the end of the available data, then
   * clamped to ensure it satisfies the current chart constraints.
   */
  public resetViewport(): void {
    _resetViewport(this.engine);
  }

  /**
   * Synchronizes the scrollbar thumb with the current viewport.
   *
   * The thumb position and size are derived from the logical visible
   * range (`viewStart` / `viewEnd`) and the total logical range
   * (`data.length + rightPadBars`).
   *
   * This function should be called whenever any value that affects the
   * viewport or the scrollbar geometry changes, including:
   *
   * - After panning the chart.
   * - After zooming (mouse wheel or pinch).
   * - After resetting or fitting the viewport.
   * - After loading or replacing the dataset.
   * - After adding or removing bars.
   * - After changing the right-side padding.
   * - After resizing the chart (the scrollbar width changes).
   */
  public updateScrollThumb(): void {
    _updateScrollThumb(this.engine);
  }

  /**
   * Scrolls the viewport to the latest available bar.
   *
   * The latest candle is positioned using the configured right-side
   * padding so new incoming bars remain visible.
   */
  public scrollToRealTime(): void {
    _scrollToRealTime(this.engine);
  }
}
