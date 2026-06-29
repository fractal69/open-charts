import type { ChartEngine } from "../core/chartEngine";

/**
 * Draws a dotted horizontal price line.
 *
 * @param engine Chart engine instance.
 * @param price Price value.
 * @param color Line color.
 * @param priceMin Visible minimum price.
 * @param priceMax Visible maximum price.
 */
export function _drawPriceLine(
  engine: ChartEngine,
  price: number,
  color: string,
  priceMin: number,
  priceMax: number,
): void {
  const ctx = engine.ctxMain;
  const pane = engine.panes.main;

  const y = Math.round(engine.utils.yOf(price, pane, priceMin, priceMax));

  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.9;

  const size = 1;
  const spacing = 6;

  for (let x = 0; x <= engine.chartW; x += spacing) {
    ctx.fillRect(x, y, size, size);
  }

  ctx.restore();
}
