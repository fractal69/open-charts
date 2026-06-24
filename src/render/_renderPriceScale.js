import {
  PRICE_SCALE_W,
  DEFAULT_OPTIONS,
  DEFAULT_BAR_W,
  SCROLL_ZOOM_FACTOR,
  MIN_BAR_W,
  MAX_BAR_W,
} from "../core/config";
import { _nicePriceSteps } from "../utils/_nicePriceSteps";

export function _renderPriceScale(priceMin, priceMax) {
  const ctx = this.ctxPScale;
  const W = PRICE_SCALE_W;
  const H = this.panes.scale.h;
  const p = this.panes.main; // yOf necesita el pane main para el height

  ctx.clearRect(0, 0, W, H);

  // Fondo
  ctx.fillStyle = this.options.colors.bg2;
  ctx.fillRect(0, 0, W, H);

  // Línea separadora izquierda
  ctx.strokeStyle = this.options.colors.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0.5, 0);
  ctx.lineTo(0.5, H);
  ctx.stroke();

  // Labels en cada grid step
  const steps = _nicePriceSteps(priceMin, priceMax, 6);
  ctx.fillStyle = this.options.colors.textDim;
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "right";
  steps.forEach((price) => {
    const y = Math.round(this._yOf(price, p, priceMin, priceMax)) + 0.5;
    ctx.fillText(price.toFixed(2), W - 8, y + 3.5);
  });

  // Tag del último close — estático, no es el crosshair
  if (!this.data.length) return;
  const last = this.data[this.data.length - 1];
  const y = this._yOf(last.c, p, priceMin, priceMax);
  const bull = last.c >= last.o;
  ctx.fillStyle = bull ? this.options.colors.bull : this.options.colors.bear;
  ctx.fillRect(1, y - 8, W - 2, 16);
  ctx.fillStyle = "#050810";
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(last.c.toFixed(2), W / 2, y + 3.5);
}
