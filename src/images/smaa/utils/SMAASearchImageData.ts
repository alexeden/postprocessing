import { RawImageData } from '../../RawImageData';

/**
 * Linearly interpolates between two values.
 * @param a - The initial value.
 * @param b - The target value.
 * @param p - The interpolation value.
 * @return The interpolated value.
 */
const lerp = (a: number, b: number, p: number) => {
  return a + (b - a) * p;
};

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
const bilinear = (e: number[]) => {
  const a = lerp(e[0], e[1], 1.0 - 0.25);
  const b = lerp(e[2], e[3], 1.0 - 0.25);

  return lerp(a, b, 1.0 - 0.125);
};

/**
 * Computes the delta distance to add in the last step of searches to the left.
 * @param left - The left edge combination.
 * @param top - The top edge combination.
 * @return The left delta distance.
 */
const deltaLeft = (left: number[], top: number[]) => {
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
};

/**
 * Computes the delta distance to add in the last step of searches to the right.
 * @param left - The left edge combination.
 * @param top - The top edge combination.
 * @return The right delta distance.
 */
const deltaRight = (left: number[], top: number[]) => {
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
};

/**
 * SMAA search image data.
 *
 * This image stores information about how many pixels the line search
 * algorithm must advance in the last step.
 *
 * Based on the official python scripts:
 * https://github.com/iryoku/smaa/tree/master/Scripts
 */
export class SMAASearchImageData {
  /**
   * Creates a new search image.
   * @return The generated image data.
   */
  static generate(): RawImageData {

    const width = 66;
    const height = 33;

    const croppedWidth = 64;
    const croppedHeight = 16;

    const data = new Uint8ClampedArray(width * height);
    const croppedData = new Uint8ClampedArray(croppedWidth * croppedHeight);

    let x;
    let y;
    let s;
    let t;
    let i;
    let e1;
    let e2;

    // Calculate delta distances.
    for (y = 0; y < height; ++y) {
      for (x = 0; x < width; ++x) {
        s = 0.03125 * x;
        t = 0.03125 * y;

        if (SMAASearchImageData.edges.has(s) && SMAASearchImageData.edges.has(t)) {
          e1 = SMAASearchImageData.edges.get(s)!;
          e2 = SMAASearchImageData.edges.get(t)!;
          // Maximize the dynamic range to help the compression.
          data[y * width + x] = (127 * deltaLeft(e1, e2));
          data[y * width + x + (width / 2)] = (127 * deltaRight(e1, e2));
        }
      }
    }

    // Crop the result to powers-of-two to make it BC4-friendly.
    // tslint:disable-next-line:ban-comma-operator
    for (i = 0, y = height - croppedHeight; y < height; ++y) {
      for (x = 0; x < croppedWidth; ++x, ++i) {
        croppedData[i] = data[y * width + x];
      }
    }

    return new RawImageData(croppedWidth, croppedHeight, croppedData, 1);
  }

  /**
   * This dictionary returns which edges are active for a certain bilinear fetch:
   * it's the reverse lookup of the bilinear function.
   */
  private static edges = new Map([
    [bilinear([0, 0, 0, 0]), [0, 0, 0, 0]],
    [bilinear([0, 0, 0, 1]), [0, 0, 0, 1]],
    [bilinear([0, 0, 1, 0]), [0, 0, 1, 0]],
    [bilinear([0, 0, 1, 1]), [0, 0, 1, 1]],

    [bilinear([0, 1, 0, 0]), [0, 1, 0, 0]],
    [bilinear([0, 1, 0, 1]), [0, 1, 0, 1]],
    [bilinear([0, 1, 1, 0]), [0, 1, 1, 0]],
    [bilinear([0, 1, 1, 1]), [0, 1, 1, 1]],

    [bilinear([1, 0, 0, 0]), [1, 0, 0, 0]],
    [bilinear([1, 0, 0, 1]), [1, 0, 0, 1]],
    [bilinear([1, 0, 1, 0]), [1, 0, 1, 0]],
    [bilinear([1, 0, 1, 1]), [1, 0, 1, 1]],

    [bilinear([1, 1, 0, 0]), [1, 1, 0, 0]],
    [bilinear([1, 1, 0, 1]), [1, 1, 0, 1]],
    [bilinear([1, 1, 1, 0]), [1, 1, 1, 0]],
    [bilinear([1, 1, 1, 1]), [1, 1, 1, 1]],
  ]);
}
