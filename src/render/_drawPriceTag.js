export function _drawPriceTag(ctx, price, y, pane, bgColor, textColor) {
  const label = price.toFixed(2);
  const tw = 58;
  const th = 16;
  const tx = this.chartW + 1;
  const ty = y - th / 2;
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.fillRect(tx, ty, tw, th);
  ctx.fillStyle = textColor === "#050810" ? "#050810" : this.options.colors.bg;
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, tx + tw / 2, ty + 11.5);
  ctx.restore();
}
