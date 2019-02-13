export class SMAAUtils {
  /**
   * Linearly interpolates between two values.
   * @param a - The initial value.
   * @param b - The target value.
   * @param p - The interpolation value.
   * @return The interpolated value.
   */
  static lerp = (a: number, b: number, p: number) => {
    return a + (b - a) * p;
  }

  /**
   * Calculates the bilinear fetch for a certain edge combination.
   *
   *     e[0]       e[1]
   *
   *              x <-------- Sample Position: (-0.25, -0.125)
   *     e[2]       e[3] <--- Current Pixel [3]: (0.0, 0.0)
   *
   * @param e - The edge combination.
   * @return The interpolated value.
   */
  static bilinear = (e: number[]) => {
    const a = SMAAUtils.lerp(e[0], e[1], 1.0 - 0.25);
    const b = SMAAUtils.lerp(e[2], e[3], 1.0 - 0.25);

    return SMAAUtils.lerp(a, b, 1.0 - 0.125);
  }

  /**
   * Computes the delta distance to add in the last step of searches to the left.
   * @param left - The left edge combination.
   * @param top - The top edge combination.
   * @return The left delta distance.
   */
  static deltaLeft = (left: number[], top: number[]) => {
    let d = 0;

    // If there is an edge, continue.
    if (top[3] === 1) {
      d += 1;
    }

    /* If an edge was previously found, there is another edge and there are no
    crossing edges, continue. */
    if (d === 1 && top[2] === 1 && left[1] !== 1 && left[3] !== 1) {
      d += 1;
    }

    return d;
  }

  /**
   * Computes the delta distance to add in the last step of searches to the right.
   * @param left - The left edge combination.
   * @param top - The top edge combination.
   * @return The right delta distance.
   */
  static deltaRight = (left: number[], top: number[]) => {
    let d = 0;

    // If there is an edge, and no crossing edges, continue.
    if (top[3] === 1 && left[1] !== 1 && left[3] !== 1) {
      d += 1;
    }

    /* If an edge was previously found, there is another edge and there are no
    crossing edges, continue. */
    if (d === 1 && top[2] === 1 && left[0] !== 1 && left[2] !== 1) {
      d += 1;
    }

    return d;
  }

  /**
   * Clamps a value to the range [0, 1].
   * @param a - The value.
   * @return The saturated value.
   */
  static saturate = (a: number) => {
    return Math.min(Math.max(a, 0.0), 1.0);
  }
}
