export function _isTimeGridLine(i, step) {
  if (i === 0 || i >= this.data.length) return false;
  const t = this.data[i].t;
  const t0 = this.data[i - 1].t;
  const DAY = 86400;
  const HOUR = 3600;
  const MINUTE = 60;
  const minOf = (ts) => Math.floor(ts / MINUTE);
  const hourOf = (ts) => Math.floor(ts / HOUR);
  const dayOf = (ts) => Math.floor(ts / DAY);
  const dowOf = (ts) => Math.floor(ts / DAY + 4) % 7;
  const yearOf = (ts) => new Date(ts * 1000).getUTCFullYear();
  const monthOf = (ts) => new Date(ts * 1000).getUTCMonth();

  if (step === "minute") return minOf(t) !== minOf(t0);
  if (step === "hour") return hourOf(t) !== hourOf(t0);
  if (step === "day") return dayOf(t) !== dayOf(t0);
  if (step === "week") return dowOf(t) === 1 && dowOf(t0) !== 1;
  if (step === "month") return monthOf(t) !== monthOf(t0);
  if (step === "quarter")
    return Math.floor(monthOf(t) / 3) !== Math.floor(monthOf(t0) / 3);
  if (step === "year") return yearOf(t) !== yearOf(t0);
  return false;
}
