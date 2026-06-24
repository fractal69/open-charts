import { _formatDateFull } from "../utils/time";

export function _drawTimeTag(idx) {
  const tCtx = this.ctxTime;
  const d = this.data[idx];
  if (!d) return;
  const x = this.utils._xOf(idx);
  const label = _formatDateFull(d.t, this.interval);
  const tw = 90;
  tCtx.save();
  tCtx.fillStyle = this.options.colors.cross;
  tCtx.fillRect(x - tw / 2, 0, tw, this.panes.time.h);
  tCtx.fillStyle = this.options.colors.bg;
  tCtx.font = "9px Inter, sans-serif";
  tCtx.textAlign = "center";
  tCtx.fillText(label, x, 14);
  tCtx.restore();
}
