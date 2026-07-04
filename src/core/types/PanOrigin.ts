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
 * Initial viewport state captured when a pan gesture starts.
 */
export interface PanOrigin {
  /** Pointer X position at the start of the pan. */
  x: number;

  y: number;

  /** First visible bar index when the pan started. */
  viewStart: number;
  viewEnd: number;

  priceMin: number;
  priceMax: number;

  barWidth: number;
}
