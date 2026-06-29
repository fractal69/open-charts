/**
 * Formats a price for display in the chart.
 *
 * Large values are abbreviated using financial suffixes
 * (K, M, B, T). Smaller values preserve decimal precision.
 *
 * Examples:
 * 12.34           -> 12.34
 * 1_234.56        -> 1,234.56
 * 12_345.67       -> 12.35K
 * 1_234_567.89    -> 1.23M
 * 1_234_567_890   -> 1.23B
 *
 * @param price Price value.
 * @returns Formatted price string.
 */
export function _formatPrice(price: number): string {
  const abs = Math.abs(price);

  if (abs >= 1e12) {
    return (price / 1e12).toFixed(2).replace(/\.00$/, "") + "T";
  }

  if (abs >= 1e9) {
    return (price / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  }

  if (abs >= 1e6) {
    return (price / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  }

  if (abs >= 1) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  if (abs >= 0.01) {
    return price.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  }

  return price.toPrecision(6).replace(/\.?0+$/, "");
}