import { _recomputeSeries } from "../core/_recomputeSeries";
import { _updateScrollThumb } from "../ui/_updateScrollThumb";
import { _updateStatusBar } from "../ui/_updateStatusBar";

export function setData(data) {
  this.data = data;

  if (data.length >= 2) {
    let minGap = Infinity;
    const n = Math.min(data.length - 1, 10);
    for (let i = 0; i < n; i++)
      minGap = Math.min(minGap, data[i + 1].t - data[i].t);
    this.interval = minGap;
  } else {
    this.interval = 86400; // fallback: daily
  }

  _recomputeSeries.call(this);

  // Cache the close of the second-to-last bar (used by incremental RSI tick)
  this._prevClose =
    data.length >= 2 ? data[data.length - 2].c : (data[0]?.c ?? 0);

  // Start at the right end — leave rightPadBars of empty space after the last candle
  const capacity = Math.floor(this.chartW / this.barWidth);
  this.viewEnd = data.length + this.rightPadBars;
  this.viewStart = Math.max(0, this.viewEnd - capacity);
  this.dirty = true;
  _updateScrollThumb.call(this);
  _updateStatusBar.call(this);
}
