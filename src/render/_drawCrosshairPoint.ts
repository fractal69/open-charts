import type { ChartEngine } from "../core/chartEngine";

/**
 * Draws the highlighted point over the selected bar close.
 */
export function _drawCrosshairPoint(
  engine: ChartEngine,
  price: number,
  barIndex: number,
  priceMin: number,
  priceMax: number,
): void {
  const ctx = engine.ctxOMain;
  const pane = engine.panes.main;

  const x = Math.round(engine.utils.xOf(barIndex));
  const y = Math.round(
    engine.utils.yOf(price, pane, priceMin, priceMax),
  );

  ctx.save();

  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);

  ctx.fillStyle = engine.options.colors.crossPt;
  ctx.fill();

  ctx.restore();
}