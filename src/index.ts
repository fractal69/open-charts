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

import { ChartEngine } from "./core/ChartEngine";

/**
 * Creates and initializes a new chart instance.
 *
 * @param container - The HTML element that will host the chart.
 * @returns A fully initialized {@link ChartEngine} instance.
 *
 * @example
 * const chart = createChart(document.getElementById("chart")!);
 */
export function createChart(container: HTMLElement): ChartEngine {
  if (!(container instanceof HTMLElement)) {
    throw new Error("createChart: container must be an HTMLElement");
  }

  return new ChartEngine(container);
}
