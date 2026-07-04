import type { ChartEngine } from "./ChartEngine";

export function _barsVisible(engine: ChartEngine) {
  return engine.viewEnd - engine.viewStart;
}
