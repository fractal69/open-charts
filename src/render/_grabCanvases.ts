import type { ChartEngine } from "../core/chartEngine";

/**
 * Retrieves all chart DOM elements and initializes their
 * corresponding 2D rendering contexts.
 */
export function _grabCanvases(engine: ChartEngine) {
  const area = engine.area;

  engine.legendDiv = area.querySelector("#chart-legend");
  engine.indicatorsDiv = area.querySelector("#chart-indicators");

  engine.cMain = area.querySelector("#canvas-main") as HTMLCanvasElement;
  engine.ctxMain = engine.cMain.getContext("2d") as CanvasRenderingContext2D;

  engine.cDrawings = area.querySelector("#canvas-drawings") as HTMLCanvasElement;
  engine.ctxDrawings = engine.cDrawings.getContext("2d") as CanvasRenderingContext2D;

  engine.pScale = area.querySelector("#canvas-pricescale")as HTMLCanvasElement;
  engine.ctxPScale = engine.pScale.getContext("2d") as CanvasRenderingContext2D;

  engine.oMain = area.querySelector("#canvas-overlay")as HTMLCanvasElement;
  engine.ctxOMain = engine.oMain.getContext("2d") as CanvasRenderingContext2D;

  engine.cTime = area.querySelector("#canvas-time")as HTMLCanvasElement;
  engine.ctxTime = engine.cTime.getContext("2d") as CanvasRenderingContext2D;

  engine.paneMainEl = area.querySelector("#pane-main");
  engine.timeAxisEl = area.querySelector("#time-axis");
  engine.scrollbarEl = area.querySelector("#scrollbar");
  engine.scrollThumbEl = area.querySelector("#scrollthumb");
  engine.statusFpsEl = area.querySelector("#status-fps");
  engine.statusBarsEl = area.querySelector("#status-bars");
  engine.statusZoomEl = area.querySelector("#status-zoom");
}
