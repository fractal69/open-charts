export function disableSeries(id) {
  const entry = this._series.get(id);
  if (entry) {
    entry.enabled = false;
    _updateLegend.call(this);
    this.dirty = true;
  }
  return this;
}
