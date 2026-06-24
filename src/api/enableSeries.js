export function enableSeries(id) {
  const entry = this._series.get(id);
  if (entry) {
    entry.enabled = true;
    _updateLegend.call(this);
    this.dirty = true;
  }
  return this;
}
