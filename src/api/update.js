export function update(candle) {
  if (!this.data.length) return this;

  const last = this.data[this.data.length - 1];
  const isNewBar =
    candle.t != null && _isDifferentBar.call(this, candle.t, last.t);

  // ── Was the viewport pinned to the live right edge before this tick?
  // "At edge" means viewEnd was within rightPadBars slots of the old data end.
  const wasAtEdge = this.viewEnd >= this.data.length;

  if (isNewBar) {
    // ── Append new candle ─────────────────────────────────────────────
    this.data.push({
      t:
        typeof candle.t === "number"
          ? candle.t
          : Math.floor(new Date(candle.t).getTime() / 1000),
      o: candle.o ?? last.c,
      h: candle.h,
      l: candle.l,
      c: candle.c,
      v: candle.v ?? 0,
    });

    _updateSeriesIncremental.call(this, true);

    // Auto-advance viewport — slide by 1, keeping rightPadBars of empty space
    if (wasAtEdge) {
      const capacity = Math.floor(this.chartW / this.barWidth);
      this.viewEnd = this.data.length + this.rightPadBars;
      this.viewStart = Math.max(0, this.viewEnd - capacity);
    }
    _updateScrollThumb.call(this);
    _updateStatusBar.call(this);
  } else {
    // ── Tick: mutate last candle in place ─────────────────────────────
    if (candle.h != null) last.h = Math.max(last.h, candle.h);
    if (candle.l != null) last.l = Math.min(last.l, candle.l);
    if (candle.c != null) last.c = candle.c;
    if (candle.v != null) last.v = candle.v;

    _updateSeriesIncremental.call(this, false);
  }

  this._liveMode = true;
  this.dirty = true;
  return this;
}
