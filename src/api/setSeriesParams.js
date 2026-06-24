export function setSeriesParams(id, patch) {
  const entry = this._series.get(id);
  if (!entry) return this;
  let needsRecompute = false;
  for (const [key, value] of Object.entries(patch)) {
    if (!entry.params[key]) continue;
    entry.params[key].value = value;
    if (entry.params[key].affectsCompute) needsRecompute = true;
  }
  if (needsRecompute) entry.values = entry.def.compute(this.data, entry.params);
  this.dirty = true;
  return this;
}
