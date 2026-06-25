export function _buildDrawingApi() {
  const engine = this;
  const area = this.area;

  return {
    get canvas() {
      return engine.cDrawings;
    },
    get ctx() {
      return engine.ctxDrawings;
    },
    get viewStart() {
      return engine.viewStart;
    },
    get viewEnd() {
      return engine.viewEnd;
    },
    get barWidth() {
      return engine.barWidth;
    },
    get chartW() {
      return engine.chartW;
    },
    get data() {
      return engine.data;
    },
    get pane() {
      return engine.panes.main;
    },
    get bus() {
      return engine._bus;
    },

    // Conversiones — siempre frescas, no capturadas al mount
    // Después — directo
    xOf(i) {
      return this.utils._xOf(i);
    },

    yOf(price) {
      const { lo, hi } = _visiblePriceRange.call(this);
      return engine.utils._yOf(price, engine.panes.main, lo, hi);
    },
    indexAtX(x) {
      return engine.utils._indexAtX(x);
    },

    priceAtY(y) {
      const { lo, hi } = _visiblePriceRange.call(this);
      const h = engine.panes.main.h;
      return lo + ((hi - lo) * (h * 0.96 - y)) / (h * 0.92);
    },

    requestRedraw() {
      engine.drawingsDirty = true;
    },

    claimPointer(v) {
      engine._pointerClaimed = !!v;
      this.area.style.cursor = v ? "crosshair" : "";
    },

    // Suscripción normalizada a eventos del chart area
    // payload: { localX, localY, barIdx, price, button, original }
    on(event, fn) {
      const target = event === "mouseup" ? window : area;

      const handler = (e) => {
        const { lo, hi } = _visiblePriceRange.call(this);
        const p = engine.panes.main;
        const localX = e.clientX - p.x;
        const localY = e.clientY - p.y;
        const barIdx = engine.utils._indexAtX(localX);
        const price = lo + ((hi - lo) * (p.h * 0.96 - localY)) / (p.h * 0.92);
        fn({
          localX,
          localY,
          barIdx,
          price,
          button: e.button ?? 0,
          original: e,
        });
      };

      target.addEventListener(event, handler);
      return () => target.removeEventListener(event, handler);
    },
  };
}
