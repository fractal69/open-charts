// OPEN-CHARTS
// Copyright (C) 2026 Juan José Caballero Rey - https://github.com/rey-sudo
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

/**
 * Pane with geometry only.
 */
export interface TimePane {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Pane that owns a rendering canvas.
 */
export interface MainPane extends TimePane {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  oCtx: CanvasRenderingContext2D;
}

/**
 * Price scale dimensions.
 */
export interface ScalePane extends TimePane {}

/**
 * Collection of panes managed by the chart engine.
 */
export interface ChartPanes {
  /** Main chart pane. */
  main: MainPane;

  /** Right-side price scale. */
  scale: ScalePane;

  /** Bottom time axis. */
  time: TimePane;
}

export type ChartPane = MainPane | ScalePane | TimePane;
