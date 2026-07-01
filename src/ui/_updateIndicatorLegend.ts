import type { ChartEngine } from "../core/chartEngine";
import type { AnyChartSeries } from "../core/types";

export function _updateIndicatorLegend(
  engine: ChartEngine,
  barIndex: number,
): void {
  const container = engine.indicatorsDiv;

  if (!container) return;

  engine._series.forEach((series: AnyChartSeries) => {
    const { def, enabled, data, values } = series;

    const id = `chart-indicators-item-${def.id}`;

    let item = container.querySelector<HTMLElement>(`#${id}`);

    const opacity = enabled ? "1" : "0.4";
    const title = enabled ? "Click to hide" : "Click to show";

    const legend = def.legend?.(data, values, barIndex) ?? [];

    const legendHtml = legend
      .map(
        (v) => `
          <span
            class="chart-indicators-item-value"
            ${v.color ? `style="color:${v.color}"` : ""}
          >
            ${v.label}: ${v.value}
          </span>
        `,
      )
      .join("");

    if (!item) {
      item = document.createElement("div");
      item.id = id;
      item.className = "chart-indicators-item";
      item.style.cursor = "pointer";

      item.addEventListener("click", () => {
        // engine.api?.toggleSeries(def.id);
      });

      container.appendChild(item);
    }

    item.innerHTML = `
      <div
        class="chart-indicators-item-dot"
        style="background:${def.color}"
      ></div>

      <span class="chart-indicators-item-name">
        ${def.label}
      </span>

      ${legendHtml}
    `;

    item.style.opacity = opacity;
    item.title = title;
  });
}
