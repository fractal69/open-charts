import type { ChartEngine } from "./chartEngine";

export function _barsVisible(engine: ChartEngine) {
  return engine.viewEnd - engine.viewStart;
}
