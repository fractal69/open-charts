import { createChart } from "../src/index";
import { CandleBubbleSeries } from "./indicators/CandleBubbleSeries/CandleBubbleSeries";
import { EMASeries } from "./indicators/EMASeries/EMASeries";

let chart1 = createChart(document.getElementById("chart-area")!);

chart1.api.applyOptions({ legend: "Bitcoin/Tether USD · 4h" });

const candleBubble = chart1.api.addSeries(CandleBubbleSeries);

const ema55 = chart1.api.addSeries(
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
const ema25 = chart1.api.addSeries(
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

//------------------------------------------------------------------------------------

let init = false;

const ws = new WebSocket("ws://localhost:3000/master/ws");

ws.addEventListener("open", () => {
  console.log("Conectado al WebSocket");
});

ws.addEventListener("message", (event) => {
  try {
    const data = JSON.parse(event.data).engine_state.timeframes["1m"];

    const candles1data = data.series["CandleBubbleSeries1"];
    const ema55data = data.series["EmaSeries_55"];
    const ema25data = data.series["EmaSeries_25"];

    if (!init) {
      candleBubble.setData(candles1data.history);
      ema55.setData(ema55data.history);
      ema25.setData(ema25data.history);
      init = true;
    }

    candleBubble.update(candles1data.history[candles1data.history.length - 1]);
    ema55.update(ema55data.history[ema55data.history.length - 1]);
    ema25.update(ema25data.history[ema25data.history.length - 1]);
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
