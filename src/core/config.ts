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

export const PRICE_SCALE_W = 72;
export const MIN_BAR_W = 1;
export const MAX_BAR_W = 40;
export const DEFAULT_BAR_W = 8;
export const SCROLL_ZOOM_FACTOR = 0.12;

export interface ChartColors {
  bg: string;
  bg2: string;
  bg3: string;

  grid: string;
  gridAlt: string;

  text: string;
  textDim: string;

  bull: string;
  bear: string;

  bullDim: string;
  bearDim: string;

  line: string;

  area1: string;
  area2: string;

  ma: string;

  bb: string;
  bbFill: string;

  cross: string;
  crossPt: string;

  vol: string;
  volBull: string;
  volBear: string;
}

export interface ChartOptions {
  rightPadBars: number;
  barWidth: number;
  minBarWidth: number;
  maxBarWidth: number;
  zoomFactor: number;
  colors: ChartColors;
}

export const DEFAULT_OPTIONS: ChartOptions = {
  rightPadBars: 20,
  barWidth: DEFAULT_BAR_W,
  minBarWidth: MIN_BAR_W,
  maxBarWidth: MAX_BAR_W,
  zoomFactor: SCROLL_ZOOM_FACTOR,

  colors: {
    bg: "#131722",
    bg2: "#1E222D",
    bg3: "#2A2E39",

    grid: "rgba(42,46,57,0.6)",
    gridAlt: "rgba(42,46,57,0.3)",

    text: "#D1D4DC",
    textDim: "#787B86",

    bull: "#22AB94",
    bear: "#F23645",

    bullDim: "rgba(34,171,148,0.15)",
    bearDim: "rgba(242,54,69,0.15)",

    line: "#2962FF",

    area1: "rgba(41,98,255,0.20)",
    area2: "rgba(41,98,255,0)",

    ma: "#FF9800",

    bb: "#7E57C2",
    bbFill: "rgba(126,87,194,0.10)",

    cross: "rgba(209,212,220,0.25)",
    crossPt: "#2962FF",

    vol: "rgba(41,98,255,0.20)",
    volBull: "rgba(34,171,148,0.35)",
    volBear: "rgba(242,54,69,0.35)",
  },
};
