import { PRICE_SCALE_W } from "./config";

/**
 * Resizes and reconfigures all chart canvases to match the current
 * layout dimensions and device pixel ratio (DPR).
 *
 * This method:
 * - Synchronizes canvas backing-store resolution with CSS dimensions.
 * - Applies HiDPI scaling for crisp rendering on Retina displays.
 * - Resets canvas transforms to prevent accumulated scaling.
 * - Updates pane geometry for the main chart, price scale, and time axis.
 * - Recalculates the available chart width.
 * - Marks rendering layers as dirty for a full redraw.
 * - Clamps the current viewport and updates the scroll thumb.
 *
 * Canvas layers:
 * - Main canvas: price series and indicators.
 * - Overlay canvas: crosshair, hover states, and interactive elements.
 * - Drawings canvas: user annotations and drawing tools.
 * - Time canvas: bottom time scale.
 * - Price scale canvas: right-side price axis.
 */
export function _resize() {
  const dpr = window.devicePixelRatio || 1;

  /**
   * Configures a canvas for HiDPI rendering to ensure sharp,
   * pixel-perfect graphics on high-density displays.
   *
   * @param {HTMLCanvasElement} canvas Target canvas element.
   * @param {HTMLElement} container Container used to determine dimensions.
   */
  const setCanvas = (canvas, container) => {
    // Get the container's current layout dimensions.
    const r = container.getBoundingClientRect();

    // Compute the physical canvas width / height using the current DPR.
    const w = Math.ceil(r.width * dpr);
    const h = Math.ceil(r.height * dpr);

    // Set the canvas backing-store width / height in physical pixels.
    canvas.width = w;
    canvas.height = h;

    // Preserve the intended visual width / height in CSS pixels.
    canvas.style.width = w / dpr + "px";
    canvas.style.height = h / dpr + "px";

    // Scale the rendering context to match DPR coordinates.
    const ctx = canvas.getContext("2d");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };

  // Main chart pane-main container.
  const pMain = this.paneMainEl;

  // Bottom time axis container.
  const tAxis = this.timeAxisEl;

  // Resize chart rendering layers.
  setCanvas(this.cMain, pMain);

  // Reset and resize overlay layer.
  setCanvas(this.oMain, pMain);

  // Resize drawings layer.
  setCanvas(this.cDrawings, pMain);

  // Resize time-axis layer.
  setCanvas(this.cTime, tAxis);

  // Read updated layout dimensions.
  const mainR = pMain.getBoundingClientRect();
  const timeR = tAxis.getBoundingClientRect();

  // Resize the fixed width / height price scale canvas.
  this.pScale.width = Math.ceil(PRICE_SCALE_W * dpr);
  this.pScale.height = Math.ceil(mainR.height * dpr);
  this.pScale.style.width = Math.ceil(PRICE_SCALE_W * dpr) / dpr + "px";
  this.pScale.style.height = Math.ceil(mainR.height * dpr) / dpr + "px";

  // Reset and apply DPR scaling to the price scale context.
  this.ctxPScale.setTransform(1, 0, 0, 1, 0, 0);
  this.ctxPScale.scale(dpr, dpr);

  /**
   * Main chart pane geometry and rendering references.
   */
  this.panes.main = {
    x: mainR.left,
    y: mainR.top,
    w: mainR.width,
    h: mainR.height,
    canvas: this.cMain,
    ctx: this.ctxMain,
    oCtx: this.ctxOMain,
  };

  /**
   * Price scale pane dimensions.
   */
  this.panes.scale = { w: PRICE_SCALE_W, h: mainR.height };

  /**
   * Time axis pane geometry.
   */
  this.panes.time = {
    x: timeR.left,
    y: timeR.top,
    w: timeR.width,
    h: timeR.height,
  };

  // Effective drawable chart width excluding the price scale.
  this.chartW = mainR.width - PRICE_SCALE_W;

  // Request a complete redraw.
  this.dirty = true;
  this.overlayDirty = true;

  // Ensure viewport constraints remain valid.
  this._clampView();

  // Recalculate scrollbar thumb size and position.
  this._updateScrollThumb();
}
