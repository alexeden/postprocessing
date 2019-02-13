// tslint:disable cyclomatic-complexity
import { Box2, Vector2 } from 'three';
import { RawImageData } from '../../RawImageData';
import { DIAGONAL_SAMPLES, SMOOTH_MAX_DISTANCE, DIAGONAL_EDGES } from './constants';

export class SMAAUtils {
  /**
   * A box.
   */
  private static readonly b0 = new Box2();

  /**
   * A box.
   */
  private static readonly b1 = new Box2();

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
  static readonly bilinear = (e: number[]) => {
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
  static readonly deltaLeft = (left: number[], top: number[]) => {
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
  static readonly deltaRight = (left: number[], top: number[]) => {
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
   * Linearly interpolates between two values.
   * @param a - The initial value.
   * @param b - The target value.
   * @param p - The interpolation value.
   * @return The interpolated value.
   */
  static readonly lerp = (a: number, b: number, p: number) => {
    return a + (b - a) * p;
  }

  /**
   * Clamps a value to the range [0, 1].
   * @param a - The value.
   * @return The saturated value.
   */
  static readonly saturate = (a: number) => {
    return Math.min(Math.max(a, 0.0), 1.0);
  }

  /**
   * A smoothing static readonly for =  small U-patterns=> .
   *
   * @param d - A smoothing factor.
   * @param b - The area that should be smoothed.
   * @return The smoothed area.
   */
  static readonly smoothArea = (d: number, b: Box2) => {

    const a1 = b.min;
    const a2 = b.max;

    const b1X = Math.sqrt(a1.x * 2.0) * 0.5;
    const b1Y = Math.sqrt(a1.y * 2.0) * 0.5;
    const b2X = Math.sqrt(a2.x * 2.0) * 0.5;
    const b2Y = Math.sqrt(a2.y * 2.0) * 0.5;

    const p = SMAAUtils.saturate(d / SMOOTH_MAX_DISTANCE);

    a1.set(SMAAUtils.lerp(b1X, a1.x, p), SMAAUtils.lerp(b1Y, a1.y, p));
    a2.set(SMAAUtils.lerp(b2X, a2.x, p), SMAAUtils.lerp(b2Y, a2.y, p));

    return b;

  }

  /**
   * Calculates the area under the line p1 -> p2, for the pixels (x, x + 1).
   *
   * @param p1 - The starting point of the line.
   * @param p2 - The ending point of the line.
   * @param x - The pixel index.
   * @param result - A target vector to store the area in.
   * @return The area.
   */
  static readonly calculateOrthogonalArea = (
    p1: Vector2,
    p2: Vector2,
    x: number,
    result: Vector2
  ) => {

    const dX = p2.x - p1.x;
    const dY = p2.y - p1.y;

    const x1 = x;
    const x2 = x + 1.0;

    const y1 = p1.y + dY * (x1 - p1.x) / dX;
    const y2 = p1.y + dY * (x2 - p1.x) / dX;

    let a;
    let a1;
    let a2;
    let t;

    // Check if x is inside the area.
    if ((x1 >= p1.x && x1 < p2.x) || (x2 > p1.x && x2 <= p2.x)) {
      // Check if this is a trapezoid.
      if (Math.sign(y1) === Math.sign(y2) || Math.abs(y1) < 1e-4 || Math.abs(y2) < 1e-4) {
        a = (y1 + y2) / 2.0;
        if (a < 0.0) {
          result.set(Math.abs(a), 0.0);
        }
        else {
          result.set(0.0, Math.abs(a));
        }
      }
      else {
        // Two triangles.
        t = -p1.y * dX / dY + p1.x;
        a1 = (t > p1.x) ? y1 * (t - Math.trunc(t)) / 2.0 : 0.0;
        a2 = (t < p2.x) ? y2 * (1.0 - (t - Math.trunc(t))) / 2.0 : 0.0;
        a = (Math.abs(a1) > Math.abs(a2)) ? a1 : -a2;
        if (a < 0.0) {
          result.set(Math.abs(a1), Math.abs(a2));
        }
        else {
          result.set(Math.abs(a2), Math.abs(a1));
        }
      }
    }
    else {
      result.set(0, 0);
    }

    return result;
  }

  /**
   * Calculates the area for a given pattern and distances to the left and to the
   * right, biased by an offset.
   *
   * @param pattern - A pattern index.
   * @param left - The left distance.
   * @param right - The right distance.
   * @param offset - An offset.
   * @param result - A target vector to store the area in.
   * @return The orthogonal area.
   */
  static readonly calculateOrthogonalAreaForPattern = (
    pattern: number,
    left: number,
    right: number,
    offset: number,
    result: Vector2
  ) => {
    const p1 = SMAAUtils.b0.min;
    const p2 = SMAAUtils.b0.max;
    const a1 = SMAAUtils.b1.min;
    const a2 = SMAAUtils.b1.max;
    const a = SMAAUtils.b1;

    /* o1           |
     *      .-------´
     * o2   |
     *
     *      <---d--->
     */
    const o1 = 0.5 + offset;
    const o2 = 0.5 + offset - 1.0;
    const d = left + right + 1;

    switch (pattern) {
      case 0: {
        //    ------
        result.set(0, 0);
        break;
      }
      case 1: {
        /*   .------
         *   |
         *
         * The offset is only applied to L patterns in the crossing edge side to
         * make it converge with the unfiltered pattern 0.
         * The pattern 0 must not be filtered to avoid artifacts.
         */
        if (left <= right) {
          SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, result);
        }
        else {
          result.set(0, 0);
        }
        break;
      }
      case 2: {
        /*    ------.
         *          |
         */
        if (left >= right) {
          SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, result);
        }
        else {
          result.set(0, 0);
        }
        break;
      }
      case 3: {
        /*   .------.
         *   |      |
         */
        SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, a1);
        SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, a2);

        SMAAUtils.smoothArea(d, a);
        result.addVectors(a1, a2);
        break;
      }
      case 4: {
        /*   |
         *   `------
         */
        if (left <= right) {
          SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, result);
        }
        else {
          result.set(0, 0);
        }
        break;
      }
      case 5: {
        /*   |
         *   +------
         *   |
         */
        result.set(0, 0);
        break;
      }
      case 6: {
        /*   |
         *   `------.
         *          |
         *
         * A problem of not offseting L patterns (see above) is that for certain
         * max search distances, the pixels in the center of a Z pattern will
         * detect the full Z pattern, while the pixels in the sides will detect an
         * L pattern. To avoid discontinuities, the full offsetted Z
         * revectorization is blended with partially offsetted L patterns.
         */
        if (Math.abs(offset) > 0.0) {
          SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, a1);
          SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, a2);
          a2.add(SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, result));
          result.addVectors(a1, a2).divideScalar(2.0);
        }
        else {
          SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
        }
        break;
      }
      case 7: {
        /*   |
         *   +------.
         *   |      |
         */
        SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
        break;
      }
      case 8: {
        /*          |
         *    ------´
         */
        if (left >= right) {
          SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, result);
        }
        else {
          result.set(0, 0);
        }
        break;
      }
      case 9: {
        /*          |
         *   .------´
         *   |
         */
        if (Math.abs(offset) > 0.0) {
          SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, a1);
          SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, a2);
          a2.add(SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, result));
          result.addVectors(a1, a2).divideScalar(2.0);
        }
        else {
          SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
        }
        break;
      }
      case 10: {
        /*          |
         *    ------+
         *          |
         */
        result.set(0, 0);
        break;
      }
      case 11: {
        /*          |
         *   .------+
         *   |      |
         */
        SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
        break;
      }
      case 12: {
        /*   |      |
         *   `------´
         */
        SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, a1);
        SMAAUtils.calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, a2);
        SMAAUtils.smoothArea(d, a);
        result.addVectors(a1, a2);
        break;
      }
      case 13: {
        /*   |      |
         *   +------´
         *   |
         */
        SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
        break;
      }
      case 14: {
        /*   |      |
         *   `------+
         *          |
         */
        SMAAUtils.calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
        break;
      }
      case 15: {
        /*   |      |
         *   +------+
         *   |      |
         */
        result.set(0, 0);
        break;
      }
    }

    return result;
  }

  /**
   * Determines whether the given pixel is inside the specified area.
   *
   * @param p1 - The lower bounds of the area.
   * @param p2 - The upper bounds of the area.
   * @param x - The X-coordinates.
   * @param y - The Y-coordinates.
   * @return Whether the pixel lies inside the area.
   */
  static readonly isInsideArea = (
    p1: Vector2,
    p2: Vector2,
    x: number,
    y: number
  ) => {
    let result = p1.equals(p2);

    let xm;
    let ym;
    let a;
    let b;
    let c;

    if (!result) {
      xm = (p1.x + p2.x) / 2.0;
      ym = (p1.y + p2.y) / 2.0;
      a = p2.y - p1.y;
      b = p1.x - p2.x;
      c = a * (x - xm) + b * (y - ym);
      result = (c > 0.0);
    }

    return result;
  }

  /**
   * Calculates the area under the line p1 -> p2 for the pixel p using brute force
   * sampling.
   *
   * @param p1 - The lower bounds of the area.
   * @param p2 - The upper bounds of the area.
   * @param pX - The X-coordinates.
   * @param pY - The Y-coordinates.
   * @return The amount of pixels inside the area relative to the total amount of sampled pixels.
   */
  static readonly calculateDiagonalAreaForPixel = (
    p1: Vector2,
    p2: Vector2,
    pX: number,
    pY: number
  ) => {
    let a;
    let x;
    let y;
    let offsetX;
    let offsetY;

    // tslint:disable-next-line:ban-comma-operator
    for (a = 0, y = 0; y < DIAGONAL_SAMPLES; ++y) {
      for (x = 0; x < DIAGONAL_SAMPLES; ++x) {
        offsetX = x / (DIAGONAL_SAMPLES - 1.0);
        offsetY = y / (DIAGONAL_SAMPLES - 1.0);
        if (SMAAUtils.isInsideArea(p1, p2, pX + offsetX, pY + offsetY)) {
          ++a;
        }
      }
    }

    return a / (DIAGONAL_SAMPLES * DIAGONAL_SAMPLES);
  }

  /**
   * Calculates the area under the line p1 -> p2. This includes the pixel and its
   * opposite.
   *
   * @param pattern - A pattern index.
   * @param p1 - The lower bounds of the area.
   * @param p2 - The upper bounds of the area.
   * @param left - The left distance.
   * @param offset - An offset.
   * @param result - A target vector to store the area in.
   * @return The area.
   */
  static readonly calculateDiagonalArea = (
    pattern: number,
    p1: Vector2,
    p2: Vector2,
    left: number,
    offset: Float32Array,
    result: Vector2
  ) => {
    const e = DIAGONAL_EDGES[pattern];
    const e1 = e[0];
    const e2 = e[1];

    if (e1 > 0) {
      p1.x += offset[0];
      p1.y += offset[1];
    }

    if (e2 > 0) {
      p2.x += offset[0];
      p2.y += offset[1];
    }

    return result.set(
      1.0 - SMAAUtils.calculateDiagonalAreaForPixel(p1, p2, 1.0 + left, 0.0 + left),
      SMAAUtils.calculateDiagonalAreaForPixel(p1, p2, 1.0 + left, 1.0 + left)
    );
  }

  /**
   * Calculates the area for a given pattern and distances to the left and to the
   * right, biased by an offset.
   *
   * @param pattern - A pattern index.
   * @param left - The left distance.
   * @param right - The right distance.
   * @param offset - An offset.
   * @param result - A target vector to store the area in.
   * @return The orthogonal area.
   */
  static readonly calculateDiagonalAreaForPattern = (
    pattern: number,
    left: number,
    right: number,
    offset: Float32Array,
    result: Vector2
  ) => {
    const p1 = SMAAUtils.b0.min;
    const p2 = SMAAUtils.b0.max;
    const a1 = SMAAUtils.b1.min;
    const a2 = SMAAUtils.b1.max;

    const d = left + right + 1;

    /* There is some Black Magic involved in the diagonal area calculations.
     *
     * Unlike orthogonal patterns, the "null" pattern (one without crossing edges)
     * must be filtered, and the ends of both the "null" and L patterns are not
     * known: L and U patterns have different endings, and the adjacent pattern is
     * unknown. Therefore, a blend of both possibilites is computed.
    */
    switch (pattern) {
      case 0: {
        /*         .-´
         *       .-´
         *     .-´
         *   .-´
         *   ´
         */

        // First possibility.
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);

        // Second possibility.
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

        // Blend both possibilities together
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 1: {
        /*         .-´
         *       .-´
         *     .-´
         *   .-´
         *   |
         *   |
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 2: {
        /*         .----
         *       .-´
         *     .-´
         *   .-´
         *   ´
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 3: {
        /*
         *         .----
         *       .-´
         *     .-´
         *   .-´
         *   |
         *   |
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, result);
        break;
      }
      case 4: {
        /*         .-´
         *       .-´
         *     .-´
         * ----´
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 5: {
        /*         .-´
         *       .-´
         *     .-´
         * --.-´
         *   |
         *   |
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 6: {
        /*         .----
         *       .-´
         *     .-´
         * ----´
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, result);
        break;
      }
      case 7: {
        /*         .----
         *       .-´
         *     .-´
         * --.-´
         *   |
         *   |
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 8: {
        /*         |
         *         |
         *       .-´
         *     .-´
         *   .-´
         *   ´
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 9: {
        /*         |
         *         |
         *       .-´
         *     .-´
         *   .-´
         *   |
         *   |
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, result);
        break;
      }
      case 10: {
        /*         |
         *         .----
         *       .-´
         *     .-´
         *   .-´
         *   ´
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 11: {
        /*         |
         *         .----
         *       .-´
         *     .-´
         *   .-´
         *   |
         *   |
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 12: {
        /*         |
         *         |
         *       .-´
         *     .-´
         * ----´
         */
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, result);
        break;
      }
      case 13: {
        /*         |
         *         |
         *       .-´
         *     .-´
         * --.-´
         *   |
         *   |
         */

        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 14: {
        /*         |
         *         .----
         *       .-´
         *     .-´
         * ----´
         */

        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 15: {
        /*         |
         *         .----
         *       .-´
         *     .-´
         * --.-´
         *   |
         *   |
         */

        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        SMAAUtils.calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
    }

    return result;
  }

  /**
   * Calculates orthogonal or diagonal patterns for a given offset.
   *
   * @param patterns - The patterns to assemble.
   * @param offset - A pattern offset. Diagonal offsets are pairs.
   * @param orthogonal - Whether the patterns are orthogonal or diagonal.
   */
  static readonly generatePatterns = (
    patterns: RawImageData[],
    offset: number | Float32Array,
    orthogonal: boolean
  ) => {
    const result = new Vector2();

    let i;
    let l;
    let x;
    let y;
    let c;

    let pattern;
    let data;
    let size;

    // tslint:disable-next-line:ban-comma-operator
    for (i = 0, l = patterns.length; i < l; ++i) {
      pattern = patterns[i];
      data = pattern.data;
      size = pattern.width;
      for (y = 0; y < size; ++y) {
        for (x = 0; x < size; ++x) {
          if (orthogonal  && typeof offset === 'number') {
            SMAAUtils.calculateOrthogonalAreaForPattern(i, x, y, offset, result);
          }
          else {
            SMAAUtils.calculateDiagonalAreaForPattern(i, x, y, offset as Float32Array, result);
          }
          c = (y * size + x) * 2;
          data[c] = result.x * 255;
          data[c + 1] = result.y * 255;
        }
      }
    }
  }
}
