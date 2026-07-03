import type { ChartEngine } from "../core/chartEngine";
import { _formatDateFull } from "../utils/time";

/**
 * Draws the crosshair time label on the time axis.
 *
 * @param engine Chart engine instance.
 * @param index Logical bar index under the crosshair.
 */
export function _drawCrosshairTimeTag(
  engine: ChartEngine,
  index: number,
): void {
  const ctx = engine.ctxTime;

  const x = engine.utils.xOf(index);
  const W = 100;
  const H = engine.panes.time.h;

  // Logical timestamp (real or virtual).
  const time = engine.utils.timeOf(index);

  // Format the timestamp according to the current interval.
  const label = _formatDateFull(time, engine.interval);

  ctx.save();

  // Draw the tag background.
  ctx.fillStyle = engine.options.colors.bg3;
  ctx.fillRect(x - W / 2, 0, W, H);

  // Draw the formatted time.
  ctx.fillStyle = engine.options.colors.textDim;
  ctx.font = `${engine.options.fontSizeNormal} ${engine.options.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, H / 2);

  ctx.restore();
}