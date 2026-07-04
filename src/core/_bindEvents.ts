import { SCROLL_ZOOM_FACTOR, MIN_BAR_W, MAX_BAR_W } from "./config";
import { _resize } from "./_resize";
import { _updateScrollThumb } from "../timeScale/_updateScrollThumb";
import { _updateStatusBar } from "../ui/_updateStatusBar";
import type { ChartEngine } from "./chartEngine";
import { DragMode, HoverArea } from "./types";

/**
 * Registers all user interaction and lifecycle event handlers
 * required by the chart, including mouse, touch, scrolling,
 * zooming, panning, scrollbar dragging, and window resizing.
 */
export function _bindEvents(engine: ChartEngine) {
  const area = engine.area;

  // Track mouse movement within the chart area.
  area.addEventListener(
    "mousemove",
    (e: any) => {
      if (!engine.hasData) return;

      const localX = e.clientX - engine.panes.main.x;
      const localY = e.clientY - engine.panes.main.y;

      if (
        localX >= engine.chartW &&
        localX <= engine.chartW + engine.options.priceScaleWidth
      ) {
        engine.hoverArea = HoverArea.PriceScale;
      } else if (localY >= engine.panes.main.h) {
        engine.hoverArea = HoverArea.TimeScale;
      } else {
        engine.hoverArea = HoverArea.Chart;
      }

      switch (engine.hoverArea) {
        case HoverArea.PriceScale:
          area.style.cursor = "ns-resize";
          break;

        case HoverArea.TimeScale:
          area.style.cursor = "ew-resize";
          break;

        case HoverArea.Chart:
          area.style.cursor =
            engine.dragMode === DragMode.Pan ? "grabbing" : "default";
          break;

        default:
          area.style.cursor = "default";
      }

      // Update the current mouse position and mark it as inside the chart.
      engine.mouse = { x: e.clientX, y: e.clientY, inside: true };

      // Handle horizontal panning while dragging.
      switch (engine.dragMode) {
        case DragMode.Pan: {
          // Calculate the horizontal drag distance from the pan start point.
          const dx = e.clientX - engine.panOrigin.x;
          const dy = e.clientY - engine.panOrigin.y;

          const priceRange =
            engine.panOrigin.priceMax - engine.panOrigin.priceMin;

          const priceDelta = (dy / engine.panes.main.h) * priceRange;

          // Calculate how many bars to shift based on the horizontal pixel movement.
          const shift = -Math.round(dx / engine.barWidth);

          // Calculate how many bars fit in the current viewport.
          const capacity = Math.max(
            1,
            Math.floor(engine.chartW / engine.barWidth),
          );

          // Keep the last real bar visible.
          // The viewport can move until the last bar reaches the left edge.
          const maxStart = Math.max(0, engine.data.length - 1);

          // Update and clamp the viewport start index.
          engine.viewStart = Math.max(
            0,
            Math.min(maxStart, engine.panOrigin.viewStart + shift),
          );

          // Recalculate the viewport end index.
          engine.viewEnd = engine.viewStart + capacity;

          // Enable manual vertical panning.
          if (dy !== 0) {
            engine.priceViewport.auto = false;

            engine.priceViewport.min = engine.panOrigin.priceMin + priceDelta;

            engine.priceViewport.max = engine.panOrigin.priceMax + priceDelta;
          }

          // Final safety clamp.
          engine.timeScale.clampView();

          // Mark the main chart layer for redraw.
          engine.dirty = true;

          // Synchronize the scrollbar thumb with the new viewport.
          engine.timeScale.updateScrollThumb();

          // Refresh status information displayed to the user.
          _updateStatusBar(engine);

          break;
        }

        case DragMode.VerticalZoom: {
          const dy = e.clientY - engine.panOrigin.y;

          const factor = Math.exp(dy * 0.003);

          const center =
            (engine.panOrigin.priceMin + engine.panOrigin.priceMax) / 2;

          const halfRange =
            ((engine.panOrigin.priceMax - engine.panOrigin.priceMin) / 2) *
            factor;

          engine.priceViewport.auto = false;

          engine.priceViewport.min = center - halfRange;
          engine.priceViewport.max = center + halfRange;

          engine.dirty = true;

          break;
        }

        case DragMode.HorizontalZoom: {
          const dx = e.clientX - engine.panOrigin.x;

          // Arrastrar hacia la derecha = zoom in.
          const factor = Math.exp(-dx * 0.0015);

          engine.barWidth = Math.max(
            MIN_BAR_W,
            Math.min(MAX_BAR_W, engine.panOrigin.barWidth * factor),
          );

          // Recalcular cuántas velas caben.
          const capacity = Math.max(
            1,
            Math.floor(engine.chartW / engine.barWidth),
          );

          // Mantener fijo el borde derecho del viewport.
          engine.viewEnd = engine.panOrigin.viewEnd;

          engine.viewStart = engine.viewEnd - capacity;

          // Ajustar límites.
          engine.timeScale.clampView();

          engine.timeScale.updateScrollThumb();

          engine.dirty = true;

          break;
        }
      }

      // Mark the overlay layer for redraw.
      engine.overlayDirty = true;
      engine.timeAxisDirty = true;
    },
    { signal: engine._abortController.signal },
  );

  // Handle pointer exit from the chart area.
  area.addEventListener(
    "mouseleave",
    () => {
      // Mark the mouse as outside the chart bounds.
      engine.mouse.inside = false;
      engine.hoverArea = HoverArea.None;
      area.style.cursor = "default";

      // Redraw overlay elements affected by hover state.
      engine.overlayDirty = true;
      engine.timeAxisDirty = true;
    },
    { signal: engine._abortController.signal },
  );

  // Restore hover state when the pointer enters the chart area.
  area.addEventListener(
    "mouseenter",
    () => {
      engine.mouse.inside = true;
    },
    { signal: engine._abortController.signal },
  );

  // Start a horizontal pan operation when the chart is clicked and dragged.
  area.addEventListener(
    "mousedown",
    (e: any) => {
      // Ignore panning if another tool or interaction has claimed the pointer.
      if (engine._pointerClaimed) return;

      if (e.button !== 0) return;

      // Current visible price range.
      const { lo, hi } = engine.core.visiblePriceRange();

      // Store the initial pointer position and viewport state.
      engine.panOrigin = {
        x: e.clientX,
        y: e.clientY,

        viewStart: engine.viewStart,
        viewEnd: engine.viewEnd,

        priceMin: lo,
        priceMax: hi,

        barWidth: engine.barWidth,
      };

      // Start the interaction depending on the hovered area.
      switch (engine.hoverArea) {
        case HoverArea.Chart:
          engine.dragMode = DragMode.Pan;
          area.style.cursor = "grabbing";
          break;

        case HoverArea.PriceScale:
          engine.dragMode = DragMode.VerticalZoom;
          area.style.cursor = "ns-resize";
          break;

        case HoverArea.TimeScale:
          engine.dragMode = DragMode.HorizontalZoom;
          area.style.cursor = "ew-resize";
          break;

        default:
          return;
      }
    },
    { signal: engine._abortController.signal },
  );

  // Handle mouse wheel zoom interaction on the chart area.
  area.addEventListener(
    "wheel",
    (e: any) => {
      // Prevent default page scrolling behavior.
      e.preventDefault();

      // Determine zoom direction based on wheel movement.
      const delta = e.deltaY > 0 ? -1 : 1;

      // Compute zoom factor applied to current bar width.
      const factor = 1 + delta * SCROLL_ZOOM_FACTOR;

      // Compute the new bar width, clamped to allowed zoom limits.
      const newBarW = Math.max(
        MIN_BAR_W,
        Math.min(MAX_BAR_W, engine.barWidth * factor),
      );

      // If zoom does not change bar width, exit early.
      if (newBarW === engine.barWidth) return;

      // Get mouse position relative to the chart content area.
      const localX = e.clientX - engine.panes.main.x;

      // Identify the bar index under the cursor (zoom focus point).
      const focusIdx = engine.utils.indexAtX(localX);

      // Apply the new zoom level.
      engine.barWidth = newBarW;

      // Recalculate how many bars fit in the viewport.
      const capacity = Math.floor(engine.chartW / engine.barWidth);

      // Compute cursor position as a ratio of chart width.
      const rel = localX / engine.chartW;

      // Keep the last real bar visible after zooming.
      const maxStart = Math.max(0, engine.data.length - 1);

      // Adjust viewport so the focused bar stays under the cursor.
      engine.viewStart = Math.max(
        0,
        Math.min(maxStart, Math.round(focusIdx - rel * capacity)),
      );

      // Recalculate viewport end based on new capacity.
      engine.viewEnd = engine.viewStart + capacity;

      // Clamp viewport to valid data bounds.
      engine.timeScale.clampView();

      // Mark chart for redraw.
      engine.dirty = true;

      // Sync scrollbar thumb with new viewport.
      engine.timeScale.updateScrollThumb();

      // Update UI status indicators.
      _updateStatusBar(engine);
    },
    { passive: false, signal: engine._abortController.signal },
  );

  // Initialize touch tracking state for mobile interactions (pan and pinch zoom).
  let lastTouches: any = [];

  // Store initial touch points when the user starts touching the chart.
  area.addEventListener(
    "touchstart",
    (e: any) => {
      // Copy current touch points so we can compare movement in touchmove.
      lastTouches = [...e.touches];
    },
    // Allow the browser to handle default behaviors (no preventDefault here).
    { passive: true, signal: engine._abortController.signal },
  );

  // Handle touch movement for mobile pan (1 finger) and pinch zoom (2 fingers).
  area.addEventListener(
    "touchmove",
    (e: any) => {
      if (!engine.hasData) return;

      // Prevent default browser behavior (scroll/zoom page).
      e.preventDefault();

      // SINGLE TOUCH: horizontal pan gesture.
      if (e.touches.length === 1 && lastTouches.length === 1) {
        // Compute horizontal movement since last frame (in pixels).
        const dx = e.touches[0].clientX - lastTouches[0].clientX;

        // Convert pixel movement into bar index shift.
        const shift = -Math.round(dx / engine.barWidth);

        // Compute how many bars fit in the visible chart area.
        const capacity = Math.floor(engine.chartW / engine.barWidth);

        // Compute the maximum valid starting index (right boundary constraint).
        const maxStart = Math.max(
          0,
          engine.data.length + engine.rightPadBars - capacity,
        );

        // Update viewport start index with clamping to valid range.
        engine.viewStart = Math.max(
          0,
          Math.min(maxStart, engine.viewStart + shift),
        );

        // Recompute viewport end index based on capacity.
        engine.viewEnd = engine.viewStart + capacity;

        // Ensure viewport stays within valid data bounds.
        engine.timeScale.clampView();

        // Mark chart for redraw.
        engine.dirty = true;

        // Update scrollbar thumb position.
        engine.timeScale.updateScrollThumb();
      }

      // TWO FINGERS: pinch zoom — reemplazar este bloque
      else if (e.touches.length === 2 && lastTouches.length === 2) {
        const prev = Math.hypot(
          lastTouches[0].clientX - lastTouches[1].clientX,
          lastTouches[0].clientY - lastTouches[1].clientY,
        );
        const curr = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const scale = curr / prev;

        engine.barWidth = Math.max(
          MIN_BAR_W,
          Math.min(MAX_BAR_W, engine.barWidth * scale),
        );

        const capacity = Math.floor(engine.chartW / engine.barWidth);
        engine.viewEnd = engine.viewStart + capacity;
        engine.timeScale.clampView();

        engine.dirty = true;
        engine.timeScale.updateScrollThumb();
      }

      // Update last known touch positions for next move event.
      lastTouches = [...e.touches];
    },
    // Enable preventDefault because we block native touch scrolling.
    { passive: false, signal: engine._abortController.signal },
  );

  // Cache references to the scrollbar thumb and track elements.
  const thumb = engine.scrollThumbEl;
  const scrollbar = engine.scrollbarEl;

  // Track scrollbar drag state and drag origin information.
  let scrollDragging = false,
    scrollOriginX = 0,
    scrollOriginVS = 0;

  // Begin scrollbar dragging when the thumb is pressed.
  thumb.addEventListener(
    "mousedown",
    (e) => {
      // Enable scrollbar drag mode.
      scrollDragging = true;
      // Store the initial mouse X position.
      scrollOriginX = e.clientX;
      // Store the viewport start index at drag start.
      scrollOriginVS = engine.viewStart;
      // Prevent the event from triggering chart panning.
      e.stopPropagation();
    },
    { signal: engine._abortController.signal },
  );

  // End the current pan operation when the mouse button is released.
  window.addEventListener(
    "mouseup",
    () => {
      // Stop scrollbar dragging.
      scrollDragging = false;

      // Finish any active drag operation.
      engine.dragMode = DragMode.None;

      // Restore the appropriate cursor.
      switch (engine.hoverArea) {
        case HoverArea.Chart:
          area.style.cursor = "grab";
          break;

        case HoverArea.PriceScale:
          area.style.cursor = "ns-resize";
          break;

        case HoverArea.TimeScale:
          area.style.cursor = "ew-resize";
          break;

        default:
          area.style.cursor = "default";
      }
    },
    { signal: engine._abortController.signal },
  );

  // Handle thumb dragging while the mouse moves.
  window.addEventListener(
    "mousemove",
    (e) => {
      if (!engine.hasData) return;

      // Ignore movement unless a scrollbar drag is active.
      if (!scrollDragging) return;

      // Get the current scrollbar track width.
      const scrollbarWidth = scrollbar.offsetWidth;

      // Compute the total scrollable range, including right padding.
      const total = engine.data.length + engine.rightPadBars;

      // Convert horizontal mouse movement into a scrollbar ratio.
      const ratio = (e.clientX - scrollOriginX) / scrollbarWidth;

      // Convert scrollbar movement into a bar index offset.
      const shift = Math.round(ratio * total);

      // Calculate how many bars fit in the current viewport.
      const capacity = Math.floor(engine.chartW / engine.barWidth);

      // Keep the last real bar visible.
      const maxStart = Math.max(0, engine.data.length - 1);

      // Update and clamp the viewport start.
      engine.viewStart = Math.max(
        0,
        Math.min(maxStart, scrollOriginVS + shift),
      );

      // Recalculate the viewport end.
      engine.viewEnd = engine.viewStart + capacity;

      // Ensure the viewport remains within valid bounds.
      engine.timeScale.clampView();

      // Mark the chart for redraw.
      engine.dirty = true;

      // Synchronize the scrollbar thumb position and size.
      engine.timeScale.updateScrollThumb();

      // Refresh viewport-related status information.
      _updateStatusBar(engine);
    },
    { signal: engine._abortController.signal },
  );

  // Recalculate chart layout when the browser window is resized.
  window.addEventListener(
    "resize",
    () => {
      _resize(engine);
      engine.dirty = true;
    },
    { signal: engine._abortController.signal },
  );
}
