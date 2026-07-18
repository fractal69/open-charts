import type {
  ChartEngine,
  MainPane,
  SeriesDefinition,
} from "../../src/core/types";

export type EMAValue = {
  time: number;
  value: number;
  start_ts: number;
  end_ts: number;
};

interface EMAParams {
  bullColor: string;
  bearColor: string;
}

export const EMASeries: SeriesDefinition<EMAValue, EMAValue, any> = {
  id: "ma",
  label: "MA 20",
  color: "#ffb830",
  layer: "foreground",
  priceTagColor: "#ffb830",
  params: {
    period: {
      type: "number",
      label: "Period",
      value: 20,
      min: 2,
      max: 200,
      step: 1,
    },
    color: { type: "color", label: "Color", value: "#ffb830" },
    width: {
      type: "number",
      label: "Width",
      value: 1.3,
      min: 0.5,
      max: 4,
      step: 0.5,
    },
    style: {
      type: "select",
      label: "Style",
      value: "solid",
      options: ["solid", "dashed", "dotted"],
    },
  },

  compute(data: EMAValue[]): any[] {
    return data;
  },

  render(
    ctx: CanvasRenderingContext2D,
    pane: MainPane,
    engine: ChartEngine,
    _data: EMAValue[],
    values: EMAValue[],
    priceMin: number,
    priceMax: number,
  ): void {
    ctx.strokeStyle = "#ffb830";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    let started = false;
    for (
      let i = engine.viewStart;
      i < engine.viewEnd && i < engine.data.length;
      i++
    ) {
      if (values[i] === null) continue;
      const x = engine.utils.xOf(i);
      const y = engine.utils.yOf(values[i].value, pane, priceMin, priceMax);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  updateIncremental(
    data: readonly EMAValue[],
    values: EMAValue[],
    isNewBar: boolean,
  ): void {
    if (isNewBar) {
      values.push(data[data.length - 1]);
    } else {
      values[values.length - 1] = data[data.length - 1];
    }
  },

  tooltipRow(values: any[], i: number): any {
    if (values[i] === null) return null;
    return { label: "MA55", value: values[i].toFixed(2), color: "#ffb830" };
  },

  priceTags(data: EMAValue[], values: EMAValue[]) {
    const last = data.at(-1);

    if (!last) {
      return [];
    }

    return [
      {
        value: last.value,
        color: this.priceTagColor!,
        label: "",
      },
    ];
  },

  valueRange(data: EMAValue[], values: EMAValue[], start: number, end: number) {
    let lo = Infinity;
    let hi = -Infinity;

    for (let i = start; i < end; i++) {
      const ema = values[i];

      if (!ema) {
        continue;
      }

      lo = Math.min(lo, ema.value);
      hi = Math.max(hi, ema.value);
    }

    if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
      return { lo: 0, hi: 1 };
    }

    return { lo, hi };
  },

  legend(data: EMAValue[], values: EMAValue[], barIndex: number) {
    const d: EMAValue = data[barIndex];

    if (!d) {
      return [];
    }

    return [
      {
        label: "T",
        value: d.time.toFixed(2),
        color: "blue",
      },
    ];
  },
};
