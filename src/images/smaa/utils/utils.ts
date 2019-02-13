// tslint:disable cyclomatic-complexity
import { Box2, Vector2 } from 'three';
import { RawImageData } from 'images/RawImageData';

export class SMAAUtils {
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
   * @param {Number} d - A smoothing factor.
   * @param {Box2} b - The area that should be smoothed.
   * @return {Box2} The smoothed area.
   */
  static readonly smoothArea = (d: number, b: Box2) => {

    const a1 = b.min;
    const a2 = b.max;

    const b1X = Math.sqrt(a1.x * 2.0) * 0.5;
    const b1Y = Math.sqrt(a1.y * 2.0) * 0.5;
    const b2X = Math.sqrt(a2.x * 2.0) * 0.5;
    const b2Y = Math.sqrt(a2.y * 2.0) * 0.5;

    const p = saturate(d / SMOOTH_MAX_DISTANCE);

    a1.set(lerp(b1X, a1.x, p), lerp(b1Y, a1.y, p));
    a2.set(lerp(b2X, a2.x, p), lerp(b2Y, a2.y, p));

    return b;

  }

  /**
   * Calculates the area under the line p1 -> p2, for the pixels (x, x + 1).
   *
   * @param {Vector2} p1 - The starting point of the line.
   * @param {Vector2} p2 - The ending point of the line.
   * @param {Number} x - The pixel index.
   * @param {Vector2} result - A target vector to store the area in.
   * @return {Vector2} The area.
   */
  static readonly calculateOrthogonalArea = (p1, p2, x: number, result) => {

    const dX = p2.x - p1.x;
    const dY = p2.y - p1.y;

    const x1 = x;
    const x2 = x + 1.0;

    const y1 = p1.y + dY * (x1 - p1.x) / dX;
    const y2 = p1.y + dY * (x2 - p1.x) / dX;

    let a, a1, a2, t;

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
   * @param {Number} pattern - A pattern index.
   * @param {Number} left - The left distance.
   * @param {Number} right - The right distance.
   * @param {Number} offset - An offset.
   * @param {Vector2} result - A target vector to store the area in.
   * @return {Vector2} The orthogonal area.
   */
  static readonly calculateOrthogonalAreaForPattern = (
    pattern: number,
    left: number,
    right: number,
    offset: number,
    result: Vector2
  ) => {

    const p1 = b0.min;
    const p2 = b0.max;
    const a1 = b1.min;
    const a2 = b1.max;
    const a = b1;

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

          calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, result);

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

          calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, result);

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

        calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, a1);
        calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, a2);

        smoothArea(d, a);
        result.addVectors(a1, a2);
        break;
      }
      case 4: {
        /*   |
         *   `------
         */

        if (left <= right) {

          calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, result);

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

          calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, a1);
          calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, a2);
          a2.add(calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, result));

          result.addVectors(a1, a2).divideScalar(2.0);

        }
        else {
          calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
        }
        break;
      }
      case 7: {
        /*   |
         *   +------.
         *   |      |
         */
        calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
        break;
      }
      case 8: {
        /*          |
         *    ------´
         */

        if (left >= right) {

          calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, result);

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

          calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, a1);
          calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, a2);
          a2.add(calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, result));

          result.addVectors(a1, a2).divideScalar(2.0);

        }
        else {
          calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
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
        calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
        break;
      }
      case 12: {
        /*   |      |
         *   `------´
         */
        calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, a1);
        calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, a2);

        smoothArea(d, a);
        result.addVectors(a1, a2);
        break;
      }
      case 13: {
        /*   |      |
         *   +------´
         *   |
         */
        calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
        break;
      }
      case 14: {
        /*   |      |
         *   `------+
         *          |
         */
        calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
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
   * @param {Vector2} p1 - The lower bounds of the area.
   * @param {Vector2} p2 - The upper bounds of the area.
   * @param {Vector2} x - The X-coordinates.
   * @param {Vector2} y - The Y-coordinates.
   * @return {Vector2} Whether the pixel lies inside the area.
   */
  static readonly isInsideArea = (p1, p2, x, y) => {

    let result = p1.equals(p2);

    let xm, ym;
    let a, b, c;

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
   * @param {Vector2} p1 - The lower bounds of the area.
   * @param {Vector2} p2 - The upper bounds of the area.
   * @param {Number} pX - The X-coordinates.
   * @param {Number} pY - The Y-coordinates.
   * @return {Number} The amount of pixels inside the area relative to the total amount of sampled pixels.
   */
  static readonly calculateDiagonalAreaForPixel = (p1, p2, pX: number, pY: number) => {

    let a;
    let x, y;
    let offsetX, offsetY;

    for (a = 0, y = 0; y < DIAGONAL_SAMPLES; ++y) {
      for (x = 0; x < DIAGONAL_SAMPLES; ++x) {
        offsetX = x / (DIAGONAL_SAMPLES - 1.0);
        offsetY = y / (DIAGONAL_SAMPLES - 1.0);
        if (isInsideArea(p1, p2, pX + offsetX, pY + offsetY)) {
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
   * @param {Number} pattern - A pattern index.
   * @param {Vector2} p1 - The lower bounds of the area.
   * @param {Vector2} p2 - The upper bounds of the area.
   * @param {Number} left - The left distance.
   * @param {Float32Array} offset - An offset.
   * @param {Vector2} result - A target vector to store the area in.
   * @return {Vector2} The area.
   */
  static readonly calculateDiagonalArea = (
    pattern: number,
    p1,
    p2,
    left: number,
    offset,
    result
  ) => {

    const e = diagonalEdges[pattern];
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
      1.0 - calculateDiagonalAreaForPixel(p1, p2, 1.0 + left, 0.0 + left),
      calculateDiagonalAreaForPixel(p1, p2, 1.0 + left, 1.0 + left)
    );
  }

  /**
   * Calculates the area for a given pattern and distances to the left and to the
   * right, biased by an offset.
   *
   * @param {Number} pattern - A pattern index.
   * @param {Number} left - The left distance.
   * @param {Number} right - The right distance.
   * @param {Float32Array} offset - An offset.
   * @param {Vector2} result - A target vector to store the area in.
   * @return {Vector2} The orthogonal area.
   */
  static readonly calculateDiagonalAreaForPattern = (
    pattern: number,
    left: number,
    right: number,
    offset,
    result
  ) => {
    const p1 = b0.min;
    const p2 = b0.max;
    const a1 = b1.min;
    const a2 = b1.max;

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
        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);

        // Second possibility.
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

        // Blend both possibilities together
        result.addVectors(a1, a2).divideScalar(2.0)
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

        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
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

        calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
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
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, result);
        break;
      }
      case 4: {
        /*         .-´
         *       .-´
         *     .-´
         * ----´
         */

        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
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

        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
        result.addVectors(a1, a2).divideScalar(2.0);
        break;
      }
      case 6: {
        /*         .----
         *       .-´
         *     .-´
         * ----´
         */
        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, result);
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

        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
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

        calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a2);
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
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, result);
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

        calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
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

        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
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
        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, result);
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

        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a2);
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

        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
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

        calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
        calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);
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
          if (orthogonal) {
            calculateOrthogonalAreaForPattern(i, x, y, offset, result);
          }
          else {
            calculateDiagonalAreaForPattern(i, x, y, offset, result);
          }
          c = (y * size + x) * 2;
          data[c] = result.x * 255;
          data[c + 1] = result.y * 255;
        }
      }
    }
  }
}
