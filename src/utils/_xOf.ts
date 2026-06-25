import type { ChartEngine } from "../core/chartEngine";

export function _xOf(this: ChartEngine, i: number) {
  return (i - this.viewStart) * this.barWidth + this.barWidth / 2;
}
