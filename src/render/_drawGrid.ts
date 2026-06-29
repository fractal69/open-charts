import { _nicePriceSteps } from "../utils/_nicePriceSteps";
import { _timeGridStep } from "./_timeGridStep";
import { _isTimeGridLine } from "./_isTimeGridLine";
import type { ChartEngine } from "../core/chartEngine";
import type { MainPane } from "../core/types";

export function _drawGrid(
  engine: ChartEngine,
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  cw: number,
  priceMin: number,
  priceMax: number,
  p: MainPane,
) {
  ctx.save();
  ctx.strokeStyle = engine.options.colors.grid;
  ctx.lineWidth = 1;

  // Horizontal price grid lines
  const steps = _nicePriceSteps(priceMin, priceMax, 6);
  steps.forEach((price) => {
    const y = Math.round(engine.utils.yOf(price, p, priceMin, priceMax)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
  });

  // Vertical time grid lines
  const timeStep = _timeGridStep(engine);
  for (
    let i = engine.viewStart;
    i < engine.viewEnd && i < engine.data.length;
    i++
  ) {
    if (_isTimeGridLine(engine, i, timeStep)) {
      const x = Math.round(engine.utils.xOf(i)) + 0.5;
      ctx.strokeStyle = engine.options.colors.grid;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
  }
  ctx.restore();
}
