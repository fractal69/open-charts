import type { ChartEngine } from "../core/ChartEngine";

/**
 * Builds or updates the chart legend displayed in the legend container.
 *
 * The legend is created lazily on first use and reused on subsequent updates.
 * Its content is regenerated from the current chart options, allowing the
 * displayed symbol or instrument name to stay synchronized with the chart.
 *
 * @param engine Chart engine instance.
 */
export function _buildLegend(engine: ChartEngine) {
  let legendContainer: HTMLDivElement | null =
    engine.legendDiv.querySelector<HTMLDivElement>("#chart-legend-content");

  const content: string = `<span class="chart-legend-item"><span class="chart-legend-symbol">${engine.options.legend}</span></span>`;

  if (!legendContainer) {
    legendContainer = document.createElement("div");
    legendContainer.id = "chart-legend-content";
    engine.legendDiv.appendChild(legendContainer);
  }

  legendContainer.innerHTML = content;
}
