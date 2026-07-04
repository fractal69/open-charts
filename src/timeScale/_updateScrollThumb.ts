import type { ChartEngine } from "../core/ChartEngine";

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
 *
 * @param engine Chart engine instance.
 */
export function _updateScrollThumb(engine: ChartEngine) {
  // Exit if no data is available.
  if (!engine.hasData) return;

  // Retrieve the draggable scrollbar thumb element.
  const thumb: HTMLElement = engine.scrollThumbEl;

  // Retrieve the scrollbar track element.
  const bar: HTMLElement = engine.scrollbarEl;

  // Calculate the total logical range, including right-side padding.
  const total: number = engine.data.length + engine.rightPadBars;

  // Get the current width of the scrollbar track in pixels.
  const scrollbarWidth: number = bar.offsetWidth;

  // Calculate the number of bars currently visible in the viewport.
  const visible: number = engine.viewEnd - engine.viewStart;

  // Compute the thumb width proportionally to the visible range,
  // enforcing a minimum width for usability.
  const thumbW: number = Math.max(20, scrollbarWidth * (visible / total));

  // Compute the thumb's horizontal position based on the
  // viewport start index relative to the total range.
  const thumbL: number = scrollbarWidth * (engine.viewStart / total);

  // Apply the calculated width to the thumb element.
  thumb.style.width = thumbW + "px";

  // Position the thumb along the scrollbar track.
  thumb.style.left = thumbL + "px";
}
