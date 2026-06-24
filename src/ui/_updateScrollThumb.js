/**
 * Updates the scrollbar thumb size and position to reflect
 * the current visible range relative to the total scrollable
 * data range, including right-side padding.
 */
export function _updateScrollThumb() {
  // Exit if no data is available.
  if (!this.data.length) return;

  // Retrieve the draggable scrollbar thumb element.
  const thumb = this.scrollThumbEl;

  // Retrieve the scrollbar track element.
  const bar = this.scrollbarEl;

  // Calculate the total logical range, including right-side padding.
  const total = this.data.length + this.rightPadBars;

  // Get the current width of the scrollbar track in pixels.
  const scrollbarWidth = bar.offsetWidth;

  // Calculate the number of bars currently visible in the viewport.
  const visible = this.viewEnd - this.viewStart;

  // Compute the thumb width proportionally to the visible range,
  // enforcing a minimum width for usability.
  const thumbW = Math.max(20, scrollbarWidth * (visible / total));

  // Compute the thumb's horizontal position based on the
  // viewport start index relative to the total range.
  const thumbL = scrollbarWidth * (this.viewStart / total);

  // Apply the calculated width to the thumb element.
  thumb.style.width = thumbW + "px";

  // Position the thumb along the scrollbar track.
  thumb.style.left = thumbL + "px";
}
