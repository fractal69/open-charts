import type { ChartEngine } from "../core/chartEngine";

export function _updateLegend(engine: ChartEngine): void {
  const container = engine.indicatorsDiv;

  if (!container) return;

  engine._series.forEach((series) => {
    const { def, enabled } = series;

    const id = `chart-indicators-item-${def.id}`;

    let item = container.querySelector<HTMLElement>(`#${id}`);

    const opacity = enabled ? "1" : "0.4";
    const title = enabled ? "Click to hide" : "Click to show";

    if (!item) {
      item = document.createElement("div");
      item.id = id;
      item.className = "chart-indicators-item";
      item.style.cursor = "pointer";

      item.innerHTML = `
        <div
          class="chart-indicators-item-dot"
          style="background:${def.color}"
        ></div>
        <span>${def.label}</span>
      `;

      item.addEventListener("click", () => {
        //engine.api?.toggleSeries(def.id);
      });

      container.appendChild(item);
    }

    item.style.opacity = opacity;
    item.title = title;
  });
}