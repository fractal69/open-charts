import { _drawCrosshairPriceTag } from "./_drawCrosshairPriceTag";
import type { ChartEngine } from "../core/ChartEngine";

/**
 * Draws the chart crosshair.
 *
 * This includes:
 * - Vertical guide line.
 * - Horizontal guide line.
 * - Crosshair price tag.
 */
export function _drawCrosshair(
  engine: ChartEngine,
  barIndex: number,
  localY: number,
  priceMin: number,
  priceMax: number,
): void {
  const ctx = engine.ctxOMain;
  const pane = engine.panes.main;

  const x = Math.round(engine.utils.xOf(barIndex)) + 0.5;

  ctx.save();

  ctx.strokeStyle = engine.options.colors.cross;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  // Vertical line.
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, pane.h);
  ctx.stroke();

  // Horizontal line.
  if (localY >= 0 && localY < pane.h) {
    const y = Math.round(localY) + 0.5;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(engine.chartW, y);
    ctx.stroke();

    _drawCrosshairPriceTag(
      engine,
      engine.utils.priceAtY(localY, pane, priceMin, priceMax),
      engine.options.colors.cross,
      priceMin,
      priceMax,
    );
  }

  ctx.restore();
}