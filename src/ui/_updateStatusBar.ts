import { _barsVisible } from "../core/_barsVisible";
import type { ChartEngine } from "../core/chartEngine";

export function _updateStatusBar(engine: ChartEngine) {
  engine.statusBarsEl.textContent = `${_barsVisible(engine)} bars`;
  engine.statusZoomEl.textContent = `×${engine.barWidth.toFixed(1)}`;
}
