export function isSeriesEnabled(id) {
  return this._series.get(id)?.enabled ?? false;
}
