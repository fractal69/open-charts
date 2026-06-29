import { _clampView } from "../../timeScale/_clampView";
import { _resetViewport } from "../../timeScale/_resetViewport";
import type { ChartEngine } from "../../core/chartEngine";
import { _nicePriceSteps } from "../../utils/_nicePriceSteps";
import { _formatPrice } from "../../utils/_formatPrice";

/**
 * PriceScale API exposed by the chart engine.
 */
export class ChartPriceScale {
  constructor(private readonly engine: ChartEngine) {}

  /**
   * Automatically adjusts the price scale width so all visible
   * price labels fit without overflowing.
   *
   * This method only updates the configured width. If the width
   * changes, the caller is responsible for invoking
   * `engine.core.resize()` to apply the new layout.
   *
   * @returns `true` if the width changed, otherwise `false`.
   */
  public autoSize(): boolean {
    if (!this.engine.hasData) {
      return false;
    }

    const ctx = this.engine.ctxPScale;

    // Match the font used by the price scale renderer.
    ctx.font = `${this.engine.options.fontSizeNormal} ${this.engine.options.fontFamily}`;

    const { lo, hi } = this.engine.core.visiblePriceRange();
    const steps = _nicePriceSteps(lo, hi, 6);

    let width = 0;

    for (const price of steps) {
      const text = _formatPrice(price);

      width = Math.max(width, Math.ceil(ctx.measureText(text).width) + 16);
    }

    width = Math.max(48, width);

    if (width === this.engine.options.priceScaleWidth) {
      return false;
    }

    this.engine.options.priceScaleWidth = width;

    return true;
  }

  /**
   * Updates the price scale layout.
   *
   * This method recalculates the required width of the price scale
   * based on the currently visible price labels. If the required
   * width changes, the chart layout is resized automatically.
   *
   * Call this method whenever the visible price labels may change,
   * including:
   * - After loading or replacing chart data.
   * - After appending or updating bars.
   * - After panning or zooming (visible price range changes).
   * - After changing the price formatter or precision.
   *
   * This method does nothing if the current width is already sufficient.
   */
  public updateLayout(): void {
    if (this.autoSize()) {
      this.engine.core.resize();
    }
  }
}
