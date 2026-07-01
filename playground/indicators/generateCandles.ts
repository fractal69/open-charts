export type CandleBubble = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;

  start_ts: number;
  end_ts: number;

  buy_qty: number;
  sell_qty: number;

  delta_pct: number;
  signal: number;

  bubble_color: "green" | "red" | "gray";
  bubble_size: number;
  show_bubble: boolean;
};

export function generateCandleBubble(
  count: number,
  {
    startPrice = 63332,
    startTs = Date.now(),
    intervalMs = 30 * 60 * 1000,
    trend = 0.0001,
    volatility = 0.002,
  } = {},
): CandleBubble[] {
  const candles: CandleBubble[] = [];

  let lastClose = startPrice;

  for (let i = 0; i < count; i++) {
    const open = lastClose;

    // Movimiento principal
    const randomMove = (Math.random() - 0.5) * volatility;
    const close = open * (1 + trend + randomMove);

    // Mechas
    const bodySize = Math.abs(close - open);

    const high =
      Math.max(open, close) + bodySize * Math.random() + open * 0.0003;

    const low =
      Math.min(open, close) - bodySize * Math.random() - open * 0.0003;

    // Volumen
    const volume = 5 + bodySize * 0.5 + Math.random() * 10;

    const start_ts = startTs + i * intervalMs;

    // ---------- Nuevos atributos ----------
    const buy_qty = Math.floor(50 + Math.random() * 250);
    const sell_qty = Math.floor(50 + Math.random() * 250);

    const totalQty = buy_qty + sell_qty;

    // Delta entre compras y ventas (-1..1)
    const delta_pct = Number(((buy_qty - sell_qty) / totalQty).toFixed(3));

    // Señal con un poco de ruido
    const signal = Number(
      Math.max(
        -1,
        Math.min(1, delta_pct + (Math.random() - 0.5) * 0.2),
      ).toFixed(3),
    );

    const bubble_color =
      delta_pct > 0.05 ? "green" : delta_pct < -0.05 ? "red" : "gray";

    const bubble_size = Number(
      (10 + Math.abs(delta_pct) * 35 + Math.random() * 5).toFixed(2),
    );

    const show_bubble = Math.random() > 0.3;
    // --------------------------------------

    candles.push({
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(5)),
      start_ts,
      end_ts: start_ts + intervalMs,

      buy_qty,
      sell_qty,
      delta_pct,
      signal,
      bubble_color,
      bubble_size,
      show_bubble,
    });

    lastClose = close;
  }

  return candles;
}

export function generateCandlesNormal(
  count: number,
  {
    startPrice = 63332,
    startTs = Date.now(),
    intervalMs = 30 * 60 * 1000,
    trend = 0.0001, // tendencia promedio por vela
    volatility = 0.002, // volatilidad
  } = {},
) {
  const candles = [];

  let lastClose = startPrice;

  for (let i = 0; i < count; i++) {
    const open = lastClose;

    // movimiento principal
    const randomMove = (Math.random() - 0.5) * volatility;
    const close = open * (1 + trend + randomMove);

    // mechas proporcionales al movimiento
    const bodySize = Math.abs(close - open);

    const high =
      Math.max(open, close) + bodySize * Math.random() + open * 0.0003;

    const low =
      Math.min(open, close) - bodySize * Math.random() - open * 0.0003;

    // volumen correlacionado con el movimiento
    const volume = 5 + bodySize * 0.5 + Math.random() * 10;

    const start_ts = startTs + i * intervalMs;

    candles.push({
      open: open.toFixed(2),
      high: high.toFixed(2),
      low: low.toFixed(2),
      close: close.toFixed(2),
      volume: volume.toFixed(5),
      start_ts,
      end_ts: start_ts + intervalMs,
    });

    lastClose = close;
  }

  return candles;
}

export function normalizeCandles(candles: any) {
  return candles.map((candle: any) => ({
    time: Math.floor(candle.start_ts / 1000), // timestamp en segundos
    open: Number(candle.open),
    high: Number(candle.high),
    low: Number(candle.low),
    close: Number(candle.close),
    volume: Number(candle.volume),
  }));
}

export function normalizeCandle(candle: any) {
  return {
    t: Math.floor(candle.start_ts / 1000), // timestamp en segundos
    o: Number(candle.open),
    h: Number(candle.high),
    l: Number(candle.low),
    c: Number(candle.close),
    v: Number(candle.volume),
  };
}
