import type { ChartEngine } from "../core/ChartEngine";
import { PRICE_SCALE_BORDER, PRICE_TAG_HEIGHT } from "../core/config";
import { _formatPrice } from "../utils/_formatPrice";

/**
 * Draws a price tag on the right-side price scale.
 *
 * @param engine Chart engine instance.
 * @param ctx Price scale rendering context.
 * @param price Price represented by the tag.
 * @param color Tag background color.
 * @param priceMin Lowest visible price.
 * @param priceMax Highest visible price.
 */
export function _drawPriceTag(
  engine: ChartEngine,
  ctx: CanvasRenderingContext2D,
  price: number,
  color: string,
  priceMin: number,
  priceMax: number,
): void {
  const pane = engine.panes.main;

  const W = engine.options.priceScaleWidth;
  const H = PRICE_TAG_HEIGHT;

  // Convert the price into a screen Y coordinate.
  const y = Math.round(
    engine.utils.yOf(price, pane, priceMin, priceMax),
  );

  // Draw the tag background.
  ctx.fillStyle = color;
  ctx.fillRect(
    PRICE_SCALE_BORDER,
    y - H / 2,
    W - PRICE_SCALE_BORDER,
    H,
  );

  // Draw the price label.
  ctx.fillStyle = engine.options.colors.text;
  ctx.font = `${engine.options.fontSizeNormal} ${engine.options.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    _formatPrice(price),
    W / 2,
    y,
  );
}