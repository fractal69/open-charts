export function setSeriesParam(id, key, value) {
  const entry = this._series.get(id);
  if (!entry || !entry.params[key]) return this;
  entry.params[key].value = value;
  // Si el param afecta el cálculo → recompute completo
  if (entry.params[key].affectsCompute) {
    entry.values = entry.def.compute(this.data, entry.params);
  }
  this.dirty = true;
  return this;
}
