import { createChart } from "../src/index";
import { CandleBubbleSeries } from "./indicators/CandleBubbleSeries";

let chart1 = createChart(document.getElementById("chart-area")!);

chart1.api.applyOptions({ legend: "Bitcoin/Tether USD · 4h" });

const candles1 = chart1.api.addSeries(CandleBubbleSeries);

//------------------------------------------------------------------------------------

let init = false;

const ws = new WebSocket("ws://localhost:3000/master/ws");

ws.addEventListener("open", () => {
  console.log("Conectado al WebSocket");
});

ws.addEventListener("message", (event) => {
  // Si el servidor envía JSON:
  try {
    const data = JSON.parse(event.data);

    if (init === false) {
      candles1.setData(
        data.engine_state.timeframes["1m"].series["CandleBubbleSeries"].history,
      );

      init = true;
    }

    candles1.update(
      data.engine_state.timeframes["1m"].series["CandleBubbleSeries"].live,
    );
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
