import { ChartEngine } from "./chart";

export function createChart(container: HTMLElement | null) {
  const chart = new ChartEngine(container);

  return chart;
}
