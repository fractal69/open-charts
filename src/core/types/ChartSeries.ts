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

import type { PriceRange } from "../_visiblePriceRange";
import type { ChartEngine } from "../ChartEngine";
import type { MainPane } from "./ChartPanes";
import type { LegendItem } from "./LegendItem";
import type { PriceTag } from "./PriceTag";

export interface TimePoint {
  time: number;
}

export type AnySeriesDefinition = SeriesDefinition<
  TimePoint,
  unknown,
  unknown,
  unknown
>;

export interface SeriesDefinition<
  TData extends TimePoint,
  TValue,
  TParams = Record<string, unknown>,
  TTooltip = unknown,
> {
  /** Unique series identifier. */
  id: string;

  /** Display label. */
  label: string;

  /** Default series color. */
  color: string;

  /** Rendering layer. */
  layer: "background" | "foreground";

  /** Series parameters. */
  params: TParams;

  /** Computes indicator values from the source data. */
  compute(data: readonly TData[]): TValue[];

  /** Renders the series. */
  render(
    ctx: CanvasRenderingContext2D,
    pane: MainPane,
    engine: ChartEngine,
    data: readonly TData[],
    values: readonly TValue[],
    priceMin: number,
    priceMax: number,
  ): void;

  /** Updates the cached values incrementally. */
  updateIncremental(
    data: readonly TData[],
    values: TValue[],
    isNewBar: boolean,
  ): void;

  /** Returns a tooltip row for the given index. */
  tooltipRow(values: readonly TValue[], index: number): TTooltip | null;

  priceTags(
    data: readonly TData[],
    values: readonly TValue[],
  ): readonly PriceTag[];

  /** Optional price tag color. */
  priceTagColor?: string;

  /**
   * Returns the visible value range used to scale the chart.
   * If omitted, the engine falls back to the default OHLC range.
   */
  valueRange(
    data: readonly TData[],
    values: readonly TValue[],
    start: number,
    end: number,
  ): PriceRange;

  legend(
    data: readonly TData[],
    values: readonly TValue[],
    index: number,
  ): readonly LegendItem[];
}

export type AnyChartSeries = ChartSeries<any, any, any>;

/**
 * Represents a chart series.
 *
 * A series owns its data, computed values, parameters,
 * and exposes the public API used by consumers.
 */
export class ChartSeries<
  TData extends TimePoint,
  TValue,
  TParams = Record<string, unknown>,
> {
  /** Indicator definition. */
  public readonly def: SeriesDefinition<TData, TValue, TParams>;

  /** Source data for the series. */
  public data: TData[] = [];

  /** Computed values used for rendering. */

  public values: TValue[] = [];

  /** Whether the series is currently visible. */
  public enabled: boolean = true;

  public interval: number = 0;

  /** User-defined series parameters. */
  public params: TParams;

  constructor(
    private readonly engine: ChartEngine,
    def: SeriesDefinition<TData, TValue, TParams>,
    params: TParams,
  ) {
    this.def = def;
    this.params = params;
  }

  /**
   * Returns the interval between consecutive bars in seconds.
   *
   * The interval is inferred from the primary series data.
   * If there are fewer than two bars, zero is returned.
   *
   * @returns Bar interval in seconds.
   */
  public getInterval(): number {
    const data: any[] = this.data;

    for (let i = 1; i < data.length; i++) {
      const interval = data[i].time - data[i - 1].time;

      if (interval > 0) {
        return interval;
      }
    }

    return 0;
  }

  /**
   * Replaces the series data.
   *
   * @param data New data set.
   * @returns The series instance.
   */
  public setData(data: readonly TData[]): void {
    this.data = [...data];

    this.values = this.def.compute(data);

    this.engine.hasData = data.length > 0;

    if (!this.engine.hasData) return;

    this.interval = this.getInterval();

    this.engine.timeScale.resetViewport();

    this.engine.priceScale.updateLayout();

    this.engine.timeScale.scrollToRealTime();

    this.engine.dirty = true;
  }

  public update(bar: TData): boolean {
    if (!bar) return false;

    let isNewBar = false;

    if (this.data.length === 0) {
      this.data.push(bar);
      this.values = this.def.compute(this.data);
    } else {
      const last = this.data[this.data.length - 1];

      if (bar.time < last.time) {
        return false;
      }

      isNewBar = bar.time > last.time;

      if (isNewBar) {
        this.data.push(bar);
      } else {
        this.data[this.data.length - 1] = bar;
      }

      this.def.updateIncremental(this.data, this.values, isNewBar);
    }

    this.engine.hasData = this.data.length > 0;

    if (!this.engine.hasData) return false;

    if (!this.interval && this.data.length >= 2) {
      this.interval = this.getInterval();
    }

    this.engine.timeScale.resetViewport();
    this.engine.priceScale.updateLayout();

    this.engine.dirty = true;

    return true;
  }

  /**
   * Enables or disables the series.
   *
   * @param visible Whether the series should be rendered.
   * @returns The series instance.
   */
  public setVisible(visible: boolean): this {
    this.enabled = visible;
    this.engine.dirty = true;

    return this;
  }

  /**
   * Removes the series from the chart.
   */
  public remove(): void {
    this.engine._series.delete(this.def.id);
    this.engine.dirty = true;
    this.engine.hasData = false;
  }
}
