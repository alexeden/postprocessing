/**
 * Returns a random float in the specified range.
 */
export const randomFloat = (low: number, high: number) => {
  return low + Math.random() * (high - low);
};
