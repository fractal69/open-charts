import { _timeGridStep } from "./_timeGridStep";
import { _formatDate } from "../utils/time";
import { _isTimeGridLine } from "./_isTimeGridLine";
import type { ChartEngine } from "../core/chartEngine";

/**
 * Renders the bottom time axis.
 *
 * Grid labels are displayed only at selected time intervals in order
 * to avoid visual clutter. The label format adapts to the current
 * chart interval.
 *
 * @param engine Chart engine instance.
 */
export function _renderTimeAxis(engine: ChartEngine): void {
  // Nothing to render if there is no data.
  if (!engine.hasData) {
    return;
  }

  const ctx = engine.ctxTime;
  const pane = engine.panes.time;

  // Clear the previous frame.
  ctx.clearRect(0, 0, pane.w, pane.h);

  // Paint the background.
  ctx.fillStyle = engine.options.colors.bg;
  ctx.fillRect(0, 0, pane.w, pane.h);

  const data: any[] = engine.data;
  const chartW = engine.chartW;

  // Determine the logical spacing between time labels.
  const step = _timeGridStep(engine);

  ctx.fillStyle = engine.options.colors.textDim;
  ctx.font = `${engine.options.fontSizeNormal} ${engine.options.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Minimum horizontal spacing between adjacent labels.
  const LABEL_GAP = 10;

  // Right edge of the last rendered label.
  let lastRight = -Infinity;

  for (
    let i = engine.viewStart;
    i < engine.viewEnd && i < data.length;
    i++
  ) {
    // Skip bars that do not align with the current grid interval.
    if (!_isTimeGridLine(engine, i, step)) {
      continue;
    }

    const x = engine.utils.xOf(i);

    // Skip labels too close to the chart edges.
    if (x < 20 || x > chartW - 20) {
      continue;
    }

    const label = _formatDate(data[i].time, step);

    // Measure the label to avoid overlaps.
    const width = ctx.measureText(label).width;

    const left = x - width / 2;
    const right = x + width / 2;

    // Skip the label if it overlaps the previous one.
    if (left <= lastRight + LABEL_GAP) {
      continue;
    }

    ctx.fillText(label, x, pane.h / 2);

    lastRight = right;
  }
}