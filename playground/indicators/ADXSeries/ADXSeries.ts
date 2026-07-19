import type {
  ChartEngine,
  MainPane,
  PriceTag,
  SeriesDefinition,
} from "../../../src/core/types";
import { drawLineSeries } from "../../helpers/drawLineSeries";

interface ADXValue {
  adx: number;
  end_ts: number;
  minus_di: number;
  plus_di: number;
  reversal: boolean;
  start_ts: number;
  time: number;
}

interface ADXParams {
  diLength: number;
  adxLength: number;
  keyLevel: number;
}

interface ADXConfig {
  id: string;
  label: string;
  color: string;
  layer: "background" | "foreground";
  priceTagColor: string;
  params: ADXParams;
}

export const ADXSeries = (config: ADXConfig) => {
  const series: SeriesDefinition<ADXValue, ADXValue, ADXParams> = {
    id: config.id,

    label: config.label,

    color: config.color,

    layer: config.layer,

    params: config.params,

    compute(data: ADXValue[]): any[] {
      return data;
    },

    updateIncremental(
      data: readonly ADXValue[],
      values: ADXValue[],
      isNewBar: boolean,
    ): void {
      if (isNewBar) {
        values.push(data[data.length - 1]);
      } else {
        values[values.length - 1] = data[data.length - 1];
      }
    },

    render(
      ctx: CanvasRenderingContext2D,
      pane: MainPane,
      engine: ChartEngine,
      _data: ADXValue[],
      values: ADXValue[],
      priceMin: number,
      priceMax: number,
    ): void {
      if (values.length < 2) return;

      // ADX
      drawLineSeries(
        ctx,
        engine,
        pane,
        values,
        (v) => v.adx,
        "#ffffff",
        2,
        priceMin,
        priceMax,
      );

      // +DI
      drawLineSeries(
        ctx,
        engine,
        pane,
        values,
        (v) => v.plus_di,
        "#2962FF",
        2,
        priceMin,
        priceMax,
      );

      // -DI
      drawLineSeries(
        ctx,
        engine,
        pane,
        values,
        (v) => v.minus_di,
        "#F23645",
        2,
        priceMin,
        priceMax,
      );

      // Reversal markers
      ctx.save();
      ctx.fillStyle = "#0096ff";

      const start = Math.max(engine.viewStart, 0);
      const end = Math.min(engine.viewEnd, values.length);

      for (let i = start; i < end; i++) {
        const v = values[i];

        if (!v.reversal || !Number.isFinite(v.adx)) {
          continue;
        }

        const x = Math.round(engine.utils.xOf(i)) + 0.5;
        const y = engine.utils.yOf(v.adx, pane, priceMin, priceMax);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Key level
      const y =
        Math.round(
          engine.utils.yOf(this.params.keyLevel, pane, priceMin, priceMax),
        ) + 0.5;

      ctx.save();

      ctx.strokeStyle = "rgba(255,255,255,.4)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(engine.chartW, y);
      ctx.stroke();

      ctx.restore();
    },

    tooltipRow(values, index) {
      const v = values[index];

      if (!v) return null;

      return `ADX ${v.adx.toFixed(2)}
+DI ${v.plus_di.toFixed(2)}
-DI ${v.minus_di.toFixed(2)}`;
    },

    priceTags(
      data: readonly ADXValue[],
      values: readonly ADXValue[],
    ): readonly PriceTag[] {
      const last = values.at(-1);

      if (!last) {
        return [];
      }

      return [
        {
          value: last.adx,
          color: "#6CFF4C",
          label: "ADX",
        },
        {
          value: last.plus_di,
          color: "#00C853",
          label: "+DI",
        },
        {
          value: last.minus_di,
          color: "#F44336",
          label: "-DI",
        },
      ];
    },

    priceTagColor: "#6CFF4C",

    valueRange(data, values, start, end) {
      let lo = Infinity;
      let hi = -Infinity;

      for (let i = start; i < end; i++) {
        const v = values[i];

        if (!v) {
          continue;
        }

        if (Number.isFinite(v.adx)) {
          lo = Math.min(lo, v.adx);
          hi = Math.max(hi, v.adx);
        }

        if (Number.isFinite(v.plus_di)) {
          lo = Math.min(lo, v.plus_di);
          hi = Math.max(hi, v.plus_di);
        }

        if (Number.isFinite(v.minus_di)) {
          lo = Math.min(lo, v.minus_di);
          hi = Math.max(hi, v.minus_di);
        }
      }

      // No valid values.
      if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
        return { lo: 0, hi: 100 };
      }

      // Always include the key level in the visible range.
      lo = Math.min(lo, this.params.keyLevel);
      hi = Math.max(hi, this.params.keyLevel);

      return { lo, hi };
    },

    legend(data: ADXValue[], values: ADXValue[], barIndex: number) {
      const d: ADXValue = data[barIndex];

      if (!d) {
        return [];
      }

      return [
        {
          label: "T",
          value: d.time.toFixed(2),
          color: this.color,
        },
      ];
    },
  };

  return series;
};
