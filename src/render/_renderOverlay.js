import { _clearOverlay } from "./_clearOverlay";
import { _renderTimeAxis } from "./_renderTimeAxis";
import { _visiblePriceRange } from "../core/_visiblePriceRange";
import { _drawPriceTag } from "./_drawPriceTag";
import { _drawTimeTag } from "./_drawTimeTag";
import { _updateOHLCVlegend } from "../ui/_updateOHLCVlegend";

export function _renderOverlay() {
  _clearOverlay.call(this, this.ctxOMain, this.panes.main);

  _renderTimeAxis.call(this);

  if (!this.mouse.inside || !this.data.length) {
    // Still draw the live price line even without crosshair
    if (this._liveMode && this.data.length) {
      const { lo, hi } = _visiblePriceRange.call(this);
      _drawLivePulse.call(this, this.ctxOMain, this.panes.main, lo, hi);
    }
    return;
  }

  const mx = this.mouse.x;
  const my = this.mouse.y;
  const pMain = this.panes.main;

  // Determine which pane mouse is in
  const inMain = my >= pMain.y && my < pMain.y + pMain.h;

  // Bar index under cursor
  const localX = mx - pMain.x;
  const barIdx = Math.max(
    this.viewStart,
    Math.min(this.viewEnd - 1, this.utils._indexAtX(localX)),
  );
  const d = this.data[barIdx]; // may be undefined in right-padding zone

  const { lo, hi } = _visiblePriceRange.call(this);

  // Live price dash — drawn unconditionally so it survives the !d early-exit below
  if (this._liveMode) _drawLivePulse.call(this, this.ctxOMain, pMain, lo, hi);

  // Crosshair X (shared across panes)
  const snapX = Math.round(this.utils._xOf(barIdx)) + 0.5;

  if (!d) {
    const ctx = this.ctxOMain;

    ctx.save();

    ctx.strokeStyle = this.options.colors.cross;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(snapX, 0);
    ctx.lineTo(snapX, pMain.h);
    ctx.stroke();

    ctx.restore();

    return;
  }

  // Main pane crosshair
  const ctx = this.ctxOMain;
  ctx.save();
  ctx.strokeStyle = this.options.colors.cross;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  ctx.beginPath();
  ctx.moveTo(snapX, 0);
  ctx.lineTo(snapX, pMain.h);
  ctx.stroke();

  if (inMain) {
    const localY = my - pMain.y;
    ctx.beginPath();
    ctx.moveTo(0, localY + 0.5);
    ctx.lineTo(this.chartW, localY + 0.5);
    ctx.stroke();
    // Price label on scale
    const crossPrice =
      lo + ((hi - lo) * (pMain.h * 0.96 - localY)) / (pMain.h * 0.92);
    _drawPriceTag.call(
      this,
      ctx,
      crossPrice,
      localY,
      pMain,
      this.options.colors.cross,
      this.options.colors.textDim,
    );
  }
  ctx.setLineDash([]);

  // Dot at close
  const dotY = this.utils._yOf(d.c, pMain, lo, hi);
  ctx.beginPath();
  ctx.arc(snapX - 0.5, dotY, 3, 0, Math.PI * 2);
  ctx.fillStyle = this.options.colors.crossPt;
  ctx.fill();
  ctx.restore();

  // Time label on axis
  _drawTimeTag.call(this, barIdx);

  // OHLC header
  _updateOHLCVlegend.call(this, d, barIdx);
}
