import { _barsVisible } from "../core/_barsVisible";
import type { ChartEngine } from "../core/ChartEngine";

/**
 * Determines the logical time unit used by the time axis grid.
 *
 * The selected unit depends on both the chart interval and the
 * currently visible time span. This prevents, for example, hourly
 * grid lines from appearing on daily charts.
 *
 * @param engine Chart engine instance.
 * @returns Grid time unit.
 */
export function _timeGridStep(
  engine: ChartEngine,
): "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year" {

  const span = _barsVisible(engine) * engine.interval;

  if (span <= 2 * 3600) return "minute";
  if (span <= 2 * 86400) return "hour";
  if (span <= 14 * 86400) return "day";
  if (span <= 120 * 86400) return "week";
  if (span <= 730 * 86400) return "month";
  if (span <= 3650 * 86400) return "quarter";

  return "year";
}