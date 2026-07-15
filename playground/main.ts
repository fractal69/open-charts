import { createChart } from "../src/index";
import { CandleBubbleSeries } from "./indicators/CandleBubbleSeries";

const fakeData: any = [
  {
    close: 63062.1,
    end_ts: 1783209660000,
    high: 63114.9,
    low: 63059.4,
    open: 63114.9,
    start_ts: 1783209600000,
    time: 1783209600,
    volume: 79.28300000000009,
  },
];

let chart1 = createChart(document.getElementById("chart-area")!);

chart1.api.applyOptions({ legend: "Bitcoin/Tether USD · 4h" });

const candles1 = chart1.api.addSeries(CandleBubbleSeries);

//candles1.setData(fakeData);

//------------------------------------------------------------------------------------

const ws = new WebSocket("ws://localhost:3000/master/ws");

ws.addEventListener("open", () => {
  console.log("Conectado al WebSocket");
});

ws.addEventListener("message", (event) => {
  // Si el servidor envía JSON:
  try {
    const data = JSON.parse(event.data);

    const candleData =
      data.engine_state.timeframes["1m"].series["CandleSeries"].live;

    candles1.update(candleData);
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
