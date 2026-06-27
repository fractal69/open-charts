import { _visiblePriceRange } from "../core/_visiblePriceRange";
import { _renderPriceScale } from "./_renderPriceScale";
import { _renderTimeAxis } from "./_renderTimeAxis";
import { _renderMain } from "./_renderMain";
import type { ChartEngine } from "../core/chartEngine";

export function _render(engine: ChartEngine) {
  if (!engine.hasData) return;

  const { lo, hi } = _visiblePriceRange(engine);
  _renderMain(engine, lo, hi);
  _renderPriceScale(engine, lo, hi);
  _renderTimeAxis(engine);
}
