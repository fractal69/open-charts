import { _nicePriceSteps } from "../utils/_nicePriceSteps";
import { _timeGridStep } from "./_timeGridStep";
import { _isTimeGridLine } from "./_isTimeGridLine";
import type { ChartEngine } from "../core/chartEngine";
import type { MainPane } from "../core/types";

/**
 * Draws the chart grid.
 *
 * The grid consists of:
 * - Horizontal price levels.
 * - Vertical time divisions.
 *
 * All horizontal lines are batched into a single path, followed by
 * all vertical lines, minimizing Canvas draw calls.
 */
export function _drawGrid(
  engine: ChartEngine,
  ctx: CanvasRenderingContext2D,
  pane: MainPane,
  priceMin: number,
  priceMax: number,
): void {
  const chartW = engine.chartW;
  const chartH = pane.h;

  ctx.save();

  ctx.strokeStyle = engine.options.colors.grid;
  ctx.lineWidth = 1;

  //
  // Horizontal price grid
  //
  const priceSteps = _nicePriceSteps(
    priceMin,
    priceMax,
    Math.max(3, Math.floor(chartH / 80)),
  );

  ctx.beginPath();

  for (const price of priceSteps) {
    const y =
      Math.round(engine.utils.yOf(price, pane, priceMin, priceMax)) + 0.5;

    ctx.moveTo(0, y);
    ctx.lineTo(chartW, y);
  }

  ctx.stroke();

  //
  // Vertical time grid
  //
  const step = _timeGridStep(engine);

  ctx.beginPath();

  for (
    let i = engine.viewStart;
    i < engine.viewEnd && i < engine.data.length;
    i++
  ) {
    if (!_isTimeGridLine(engine, i, step)) continue;

    const x = Math.round(engine.utils.xOf(i)) + 0.5;

    ctx.moveTo(x, 0);
    ctx.lineTo(x, chartH);
  }

  ctx.stroke();

  ctx.restore();
}