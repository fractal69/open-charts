import type { ChartEngine } from "../core/types";

export function _destroy(engine: ChartEngine) {
  engine._running = false;

  if (engine._rafId) cancelAnimationFrame(engine._rafId);

  engine._abortController.abort();

  engine._drawingModules.forEach((handle: any) => handle.destroy());
  engine._drawingModules.clear();

  if (engine.area) engine.area.innerHTML = "";

  for (const series of engine._series.values()) {
    series.destroy();
  }

  engine._series.clear();
}
