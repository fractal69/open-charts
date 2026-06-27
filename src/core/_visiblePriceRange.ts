import type { ChartEngine } from "./chartEngine";

export function _visiblePriceRange(engine: ChartEngine) {
  const data: any = engine.data;

  let lo = Infinity,
    hi = -Infinity;
  const vs = Math.max(0, engine.viewStart);
  const ve = Math.min(data.length, engine.viewEnd);
  for (let i = vs; i < ve; i++) {
    if (data[i].l < lo) lo = data[i].l;
    if (data[i].h > hi) hi = data[i].h;
  }
  // Let enabled series extend the visible price range (e.g. BB bands)
  engine._series.forEach(({ def, values, enabled }) => {
    /** 
    if (!enabled || !def?.priceExtent) return;
    const ext = def?.priceExtent(values, vs, ve);
    if (ext) {
      lo = Math.min(lo, ext[0]);
      hi = Math.max(hi, ext[1]);
    }
*/
  });
  // Add padding
  const pad = (hi - lo) * 0.06;
  return { lo: lo - pad, hi: hi + pad };
}
