import type { ChartEngine } from "../core/ChartEngine";

/**
 * Returns the logical timestamp for a bar index.
 *
 * Existing bars return their stored timestamp. Future bars are
 * extrapolated according to the active trading calendar.
 *
 * For now, future timestamps assume a continuous market
 * (crypto / 24x7). In the future this branch can delegate to
 * a trading-session calendar that skips weekends, holidays and
 * market closures without changing callers.
 *
 * @param engine Chart engine instance.
 * @param index Logical bar index.
 */
export function _timeOf(
  engine: ChartEngine,
  index: number,
): number {
  const data: any[] = engine.data;

  // Existing bar.
  if (index < data.length) {
    return data[index].time;
  }

  const lastIndex = data.length - 1;
  const lastTime = data[lastIndex].time;

  // Future bar offset.
  const barsAhead = index - lastIndex;

  // TODO:
  // Replace this with:
  //
  // return engine.calendar.nextTime(lastTime, barsAhead);
  //
  // so non-continuous markets can skip weekends, holidays and
  // session gaps.
  return lastTime + barsAhead * engine.interval;
}