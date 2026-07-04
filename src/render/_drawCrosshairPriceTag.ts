import type { ChartEngine } from "../core/ChartEngine";
import { PRICE_SCALE_BORDER, PRICE_TAG_HEIGHT } from "../core/config";
import { _formatPrice } from "../utils/_formatPrice";

/**
 * Draws the crosshair price tag and positions the HTML "+" button.
 *
 * @param engine Chart engine instance.
 * @param price Crosshair price.
 * @param color Tag background color.
 * @param priceMin Lowest visible price.
 * @param priceMax Highest visible price.
 */
export function _drawCrosshairPriceTag(
  engine: ChartEngine,
  price: number,
  color: string,
  priceMin: number,
  priceMax: number,
): void {
  const ctx = engine.ctxOMain;

  const mainPane = engine.panes.main;
  const scalePane = engine.panes.scale;

  const y = Math.round(engine.utils.yOf(price, mainPane, priceMin, priceMax));

  const W = scalePane.w;
  const H = PRICE_TAG_HEIGHT;
  const X = scalePane.x;

  ctx.save();

  // Draw the tag background.
  ctx.fillStyle = color;
  ctx.fillRect(X + PRICE_SCALE_BORDER, y - H / 2, W - PRICE_SCALE_BORDER, H);

  // Draw the price label.
  ctx.fillStyle = engine.options.colors.text;
  ctx.font = `${engine.options.fontSizeNormal} ${engine.options.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(_formatPrice(price), X + W / 2, y);

  ctx.restore();

  // Position the HTML "+" button.
  const button = engine.crosshairPlusButton;

  if (button) {
    const size = H;

    button.style.left = `${X - size}px`;
    button.style.top = `${y - size / 2}px`;
    button.style.width = `${size}px`;
    button.style.height = `${size}px`;
    button.style.display = "flex";
  }
}
