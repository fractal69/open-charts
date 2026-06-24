export function _yOf(price, pane, priceMin, priceMax) {
  const range = priceMax - priceMin || 1;
  return pane.h - ((price - priceMin) / range) * pane.h * 0.92 - pane.h * 0.04;
}
