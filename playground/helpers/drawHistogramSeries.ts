// OPEN-CHARTS
// Copyright (C) 2026 Juan José Caballero Rey
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import type { ChartEngine } from "../../src/core/ChartEngine";
import type { MainPane } from "../../src/core/types";

export function drawHistogramSeries<T>(
  ctx: CanvasRenderingContext2D,
  pane: MainPane,
  engine: ChartEngine,
  values: readonly T[],
  valueMin: number,
  valueMax: number,
  getValue: (value: T, index: number) => number,
  getColor: (value: T, index: number) => string,
): void {
  const zeroY = Math.round(engine.utils.yOf(0, pane, valueMin, valueMax));

  const barWidth = Math.max(1, engine.barWidth - 1);

  for (let i = engine.viewStart; i < engine.viewEnd && i < values.length; i++) {
    const value = getValue(values[i], i);

    if (!Number.isFinite(value)) {
      continue;
    }

    const x = Math.round(engine.utils.xOf(i) - barWidth / 2);
    const y = Math.round(engine.utils.yOf(value, pane, valueMin, valueMax));

    const top = Math.min(y, zeroY);
    const height = Math.max(1, Math.abs(zeroY - y));

    ctx.fillStyle = getColor(values[i], i);
    ctx.fillRect(x, top, barWidth, height);
  }
}
