import type { ChartEngine } from "./chartEngine";
import type { ChartSeries } from "./types/engine";

// Recompute values for all registered series (called on full load)
export function _recomputeSeries(engine: ChartEngine) {
  engine._series.forEach((entry: ChartSeries) => {
    entry.values = entry.def.compute(engine);
  });
}
