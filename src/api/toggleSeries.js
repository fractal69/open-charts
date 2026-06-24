// Toggle enabled/disabled for a series by id
export function toggleSeries(id) {
  const entry = this._series.get(id);
  if (!entry) return this;
  entry.enabled = !entry.enabled;
  _updateLegend.call(this);
  this.dirty = true;
  return this;
}
