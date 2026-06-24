export function getSeriesParams(id) {
  const entry = this._series.get(id);
  if (!entry) return null;
  const out = {};
  for (const [k, field] of Object.entries(entry.params)) out[k] = field.value;
  return out;
}
