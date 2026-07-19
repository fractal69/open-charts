import { createChart } from "../src/index";
import { CandleBubbleSeries } from "./indicators/CandleBubbleSeries/CandleBubbleSeries";
import { EMASeries } from "./indicators/EMASeries/EMASeries";

let chart1 = createChart(document.getElementById("chart-area")!);
let chart2 = createChart(document.getElementById("chart-area-2")!);

chart1.api.applyOptions({ legend: "Bitcoin/Tether USD · 4h" });
chart2.api.applyOptions({ legend: "Bitcoin/Tether USD · 30m" });

const chart1_candles = chart1.api.addSeries(CandleBubbleSeries);
const chart2_candles = chart2.api.addSeries(CandleBubbleSeries);

const chart1_ema55 = chart1.api.addSeries(
  EMASeries({
    id: "ema55",
    label: "EMA 55",
    color: "#ffb830",
    layer: "foreground",
    priceTagColor: "#ffb830",
    params: {
      lineWidth: 2,
    },
  }),
);

const chart2_ema55 = chart2.api.addSeries(
  EMASeries({
    id: "ema55_2",
    label: "EMA 55",
    color: "#ffb830",
    layer: "foreground",
    priceTagColor: "#ffb830",
    params: {
      lineWidth: 2,
    },
  }),
);

const chart1_ema25 = chart1.api.addSeries(
  EMASeries({
    id: "ema25",
    label: "EMA 25",
    color: "white",
    layer: "foreground",
    priceTagColor: "white",
    params: {
      lineWidth: 1,
    },
  }),
);

const chart2_ema25 = chart2.api.addSeries(
  EMASeries({
    id: "ema25_2",
    label: "EMA 25",
    color: "white",
    layer: "foreground",
    priceTagColor: "white",
    params: {
      lineWidth: 1,
    },
  }),
);

//------------------------------------------------------------------------------------

const ws = new WebSocket("ws://localhost:3000/master/ws");

ws.addEventListener("open", () => {
  console.log("Conectado al WebSocket");
});

ws.addEventListener("message", (event) => {
  try {
    const data = JSON.parse(event.data);

    const tf1 = {
      candles: data.engine_state.timeframes["4h"].series["CandleBubbleSeries1"],
      ema55: data.engine_state.timeframes["4h"].series["EmaSeries_55"],
      ema25: data.engine_state.timeframes["4h"].series["EmaSeries_25"],
    };

    const tf2 = {
      candles:
        data.engine_state.timeframes["30m"].series["CandleBubbleSeries2"],
      ema55: data.engine_state.timeframes["30m"].series["EmaSeries_55"],
      ema25: data.engine_state.timeframes["30m"].series["EmaSeries_25"],
    };

    chart1_candles.patchData(tf1.candles.history);
    chart2_candles.patchData(tf2.candles.history);

    chart1_ema55.patchData(tf1.ema55.history);
    chart2_ema55.patchData(tf2.ema55.history);

    chart1_ema25.patchData(tf1.ema25.history);
    chart2_ema25.patchData(tf2.ema25.history);
  } catch {
    // No era JSON
  }
});

ws.addEventListener("close", (event) => {
  console.log(`Conexión cerrada. Código: ${event.code}`);
});

ws.addEventListener("error", (event) => {
  console.error("Error en el WebSocket:", event);
});

/** 
//const MAseries = chart.api.addSeries(MovingAverageSeries);

//MAseries.setData(normalizeCandles(fakeData));
*/

//let indicatorLeft1 = createChart(document.getElementById("left-pane-1")!);

//const ADX1 = indicatorLeft1.api.addSeries(ADXSeries);

//ADX1.setData(normalizeCandles(fakeData));

//

//let indicatorLeft2 = createChart(document.getElementById("left-pane-2")!);

//const SQUEEZE = indicatorLeft2.api.addSeries(SqueezeSeries);

//SQUEEZE.setData(normalizeCandles(fakeData));
