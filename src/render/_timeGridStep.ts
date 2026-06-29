import { _barsVisible } from "../core/_barsVisible";
import type { ChartEngine } from "../core/chartEngine";

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

  // Sub-minute and minute charts.
  if (engine.interval < 3600) {
    if (span <= 2 * 3600) return "minute";
    if (span <= 2 * 86400) return "hour";
    if (span <= 60 * 86400) return "day";
    return "week";
  }

  // Hourly charts.
  if (engine.interval < 86400) {
    if (span <= 14 * 86400) return "day";
    if (span <= 120 * 86400) return "week";
    return "month";
  }

  // Daily charts.
  if (engine.interval < 7 * 86400) {
    if (span <= 365 * 86400) return "month";
    return "quarter";
  }

  // Weekly charts.
  if (engine.interval < 30 * 86400) {
    return "quarter";
  }

  // Monthly and higher.
  return "year";
}