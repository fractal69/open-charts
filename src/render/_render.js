import { _visiblePriceRange } from "../core/_visiblePriceRange";
import { _renderPriceScale } from "./_renderPriceScale";
import { _renderTimeAxis } from "./_renderTimeAxis";
import { _renderMain } from "./_renderMain";

export function _render() {
  if (!this.data.length) return;
  const { lo, hi } = _visiblePriceRange.call(this);
  _renderMain.call(this, lo, hi);
  _renderPriceScale.call(this, lo, hi);
  _renderTimeAxis.call(this);
}
