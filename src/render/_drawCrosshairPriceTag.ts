import type { ChartEngine } from "../core/chartEngine";

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

  const y = Math.round(
    engine.utils.yOf(price, mainPane, priceMin, priceMax),
  );

  const tagW = scalePane.w;
  const tagH = 18;
  const tagX = scalePane.x;

  ctx.save();

  // Price tag.
  ctx.fillStyle = color;
  ctx.fillRect(tagX, y - tagH / 2, tagW, tagH);

  ctx.fillStyle = engine.options.colors.text;
  ctx.font = `${engine.options.fontSizeNormal} ${engine.options.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    price.toFixed(2),
    tagX + tagW / 2,
    y,
  );

  ctx.restore();

  // Position the HTML "+" button.
  const button = engine.crosshairPlusButton;

  if (button) {
    button.style.left = `${tagX - 19}px`;
    button.style.top = `${y - 9}px`;
    button.style.display = "flex";
  }
}