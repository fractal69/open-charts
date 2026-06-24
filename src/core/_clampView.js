/**
 * Keeps the chart viewport within valid data limits and
 * recalculates the visible range according to the current
 * zoom level and available chart width.
 */
export function _clampView() {
  // Exit if no data is available.
  if (!this.data.length) return;

  // Calculate how many bars fit within the current chart width.
  const capacity = Math.floor(this.chartW / this.barWidth);

  // Determine the maximum allowed end index, including right padding.
  const maxViewEnd = this.data.length + this.rightPadBars;

  // Clamp the viewport end index to the valid range.
  this.viewEnd = Math.min(Math.max(this.viewEnd, 1), maxViewEnd);

  // Recalculate the viewport start index based on chart capacity.
  this.viewStart = Math.max(0, this.viewEnd - capacity);
}
