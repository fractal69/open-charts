import { _clearOverlay } from "./_clearOverlay";
import { _renderTimeAxis } from "./_renderTimeAxis";
import { _visiblePriceRange } from "../core/_visiblePriceRange";
import { _drawPriceTag } from "./_drawPriceTag";
import { _drawTimeTag } from "./_drawTimeTag";
import { _updateOHLCVlegend } from "../ui/_updateOHLCVlegend";
import type { ChartEngine } from "../core/chartEngine";
import { _drawLivePulse } from "./_drawLivePulse";
import { _drawCrosshairPriceTag } from "./_drawCrosshairPriceTag";

export function _renderOverlay(engine: ChartEngine): void {
  _clearOverlay(engine.ctxOMain, engine.panes.main);

  _renderTimeAxis(engine);

  const { lo, hi } = _visiblePriceRange(engine);

  // Always draw the live price pulse.
  if (engine._liveMode && engine.hasData) {
    _drawLivePulse(engine.ctxOMain, engine.panes.main, lo, hi);
  }

  if (!engine.mouse.inside || !engine.hasData) {
    return;
  }

  const ctx = engine.ctxOMain;
  const pane = engine.panes.main;

  const localX = engine.mouse.x - pane.x;
  const localY = engine.mouse.y - pane.y;

  const barIdx = Math.max(
    engine.viewStart,
    Math.min(engine.viewEnd - 1, engine.utils.indexAtX(localX)),
  );

  const bar: any = engine.data[barIdx];

  // Crosshair X position.
  const snapX = Math.round(engine.utils.xOf(barIdx)) + 0.5;

  ctx.save();

  ctx.strokeStyle = engine.options.colors.cross;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  // Vertical crosshair.
  ctx.beginPath();
  ctx.moveTo(snapX, 0);
  ctx.lineTo(snapX, pane.h);
  ctx.stroke();

  // Draw horizontal crosshair only inside the main pane.
  if (localY >= 0 && localY <= pane.h) {
    ctx.beginPath();
    ctx.moveTo(0, localY + 0.5);
    ctx.lineTo(engine.chartW, localY + 0.5);
    ctx.stroke();

    const crossPrice = engine.utils.priceAtY(localY, pane, lo, hi);

    _drawCrosshairPriceTag(
      engine,
      crossPrice,
      engine.options.colors.cross,
      lo,
      hi,
    );
  }

  ctx.restore();

  // Nothing else to draw if the cursor is over the right padding.
  if (!bar) {
    return;
  }

  // Highlight the bar close.
  const dotY = engine.utils.yOf(bar.close, pane, lo, hi);

  ctx.beginPath();
  ctx.arc(snapX - 0.5, dotY, 3, 0, Math.PI * 2);
  ctx.fillStyle = engine.options.colors.crossPt;
  ctx.fill();

  // Draw the time label.
  _drawTimeTag(engine, barIdx);

  // Update the OHLC legend.
  _updateOHLCVlegend(engine, bar, barIdx);
}
