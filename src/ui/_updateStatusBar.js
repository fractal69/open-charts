import { _barsVisible } from "../core/_barsVisible";

export function _updateStatusBar() {
  this.statusBarsEl.textContent = `${_barsVisible.call(this)} bars`;
  this.statusZoomEl.textContent = `×${this.barWidth.toFixed(1)}`;
}
