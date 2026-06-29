/**
 * Generates "nice" price levels for the price grid.
 *
 * The returned values are rounded to human-friendly intervals
 * such as 1, 2, 2.5, 5, 10, 20, 50, etc.
 *
 * @param min Minimum visible price.
 * @param max Maximum visible price.
 * @param targetCount Desired number of grid lines.
 * @returns Ordered array of price levels.
 */
export function _nicePriceSteps(
  min: number,
  max: number,
  targetCount: number,
): number[] {
  const range = Math.max(max - min, Number.EPSILON);

  // Approximate spacing between grid lines.
  const roughStep = range / Math.max(1, targetCount);

  // Determine the order of magnitude.
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));

  // Snap to a human-friendly step size.
  const multiples = [1, 2, 2.5, 5, 10];

  const step =
    multiples.find((m) => m * magnitude >= roughStep)! * magnitude;

  // Align the first grid line to the step.
  const first = Math.ceil(min / step) * step;

  const steps: number[] = [];

  // Avoid floating-point accumulation by using an index.
  for (let i = 0; ; i++) {
    const value = first + i * step;

    if (value > max + step * 0.5) {
      break;
    }

    steps.push(+value.toFixed(10));
  }

  return steps;
}