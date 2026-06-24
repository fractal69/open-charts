import { _nicePriceSteps } from "../utils/_nicePriceSteps";
import { _timeGridStep } from "./_timeGridStep";
import { _isTimeGridLine } from "./_isTimeGridLine";

export function _drawGrid(ctx, W, H, cw, priceMin, priceMax, p) {
  ctx.save();
  ctx.strokeStyle = this.options.colors.grid;
  ctx.lineWidth = 1;

  // Horizontal price grid lines
  const steps = _nicePriceSteps(priceMin, priceMax, 6);
  steps.forEach((price) => {
    const y = Math.round(this.utils._yOf(price, p, priceMin, priceMax)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
  });

  // Vertical time grid lines
  const timeStep = _timeGridStep.call(this);
  for (let i = this.viewStart; i < this.viewEnd && i < this.data.length; i++) {
    if (_isTimeGridLine.call(this, i, timeStep)) {
      const x = Math.round(this.utils._xOf(i)) + 0.5;
      ctx.strokeStyle = this.options.colors.grid;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
  }
  ctx.restore();
}
