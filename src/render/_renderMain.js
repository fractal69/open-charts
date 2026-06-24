export function _renderMain(priceMin, priceMax) {
  const p = this.panes.main;
  const ctx = p.ctx;
  const W = p.w;
  const H = p.h;
  const cw = this.chartW;

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = this.options.colors.bg;
  ctx.fillRect(0, 0, W, H);

  // Grid
  this._drawGrid(ctx, W, H, cw, priceMin, priceMax, p);

  // ── Custom series (behind candles): fill-type series like BB render here
  this._series.forEach(({ def, values, enabled, params }) => {
    if (!enabled || def.layer !== "background") return;
    ctx.save();
    def.render(ctx, p, this, values, priceMin, priceMax, params);
    ctx.restore();
  });

  // ── Custom series (foreground): line-type series like MA render here — above candles
  this._series.forEach(({ def, values, enabled, params }) => {
    if (!enabled || def.layer === "background") return;
    ctx.save();
    def.render(ctx, p, this, values, priceMin, priceMax, params);
    ctx.restore();
  });
}
