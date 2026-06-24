export function _drawLivePulse(ctx, pane, priceMin, priceMax) {
  const last = this.data[this.data.length - 1];
  if (!last) return;

  const y = this.utils._yOf(last.c, pane, priceMin, priceMax);
  const bull = last.c >= last.o;
  const col = bull ? this.options.colors.bull : this.options.colors.bear;
  const snapY = Math.round(y) + 0.5;

  ctx.save();

  // Dashed horizontal line across the chart area
  ctx.strokeStyle = bull ? "rgba(0,200,122,0.55)" : "rgba(255,64,96,0.55)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(0, snapY);
  ctx.lineTo(this.chartW, snapY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Solid price tag on the scale
  const tw = 58,
    th = 16;
  const tx = this.chartW + 1;
  const ty = snapY - th / 2;
  ctx.fillStyle = col;
  ctx.fillRect(tx, ty, tw, th);
  ctx.fillStyle = "#050810";
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(last.c.toFixed(2), tx + tw / 2, ty + 11.5);

  ctx.restore();
}
