import type { ChartEngine } from "../core/chartEngine";
import { _formatDateFull } from "../utils/time";

/**
 * Draws the crosshair time label on the time axis.
 *
 * @param engine Chart engine instance.
 * @param index Data index under the crosshair.
 */
export function _drawTimeTag(
  engine: ChartEngine,
  index: number,
): void {
  const data: any = engine.data[index];

  // Nothing to draw if the index is outside the dataset.
  if (!data) return;

  const ctx = engine.ctxTime;
  const x = engine.utils.xOf(index);
  const W = 100;
  const H = engine.panes.time.h;

  // Format the timestamp according to the current interval.
  const label = _formatDateFull(data.time, engine.interval);

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