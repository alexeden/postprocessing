import { RawImageData } from '../../RawImageData';
import { SMAAUtils } from './utils';

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
          data[y * width + x] = (127 * SMAAUtils.deltaLeft(e1, e2));
          data[y * width + x + (width / 2)] = (127 * SMAAUtils.deltaRight(e1, e2));
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
    [SMAAUtils.bilinear([0, 0, 0, 0]), [0, 0, 0, 0]],
    [SMAAUtils.bilinear([0, 0, 0, 1]), [0, 0, 0, 1]],
    [SMAAUtils.bilinear([0, 0, 1, 0]), [0, 0, 1, 0]],
    [SMAAUtils.bilinear([0, 0, 1, 1]), [0, 0, 1, 1]],

    [SMAAUtils.bilinear([0, 1, 0, 0]), [0, 1, 0, 0]],
    [SMAAUtils.bilinear([0, 1, 0, 1]), [0, 1, 0, 1]],
    [SMAAUtils.bilinear([0, 1, 1, 0]), [0, 1, 1, 0]],
    [SMAAUtils.bilinear([0, 1, 1, 1]), [0, 1, 1, 1]],

    [SMAAUtils.bilinear([1, 0, 0, 0]), [1, 0, 0, 0]],
    [SMAAUtils.bilinear([1, 0, 0, 1]), [1, 0, 0, 1]],
    [SMAAUtils.bilinear([1, 0, 1, 0]), [1, 0, 1, 0]],
    [SMAAUtils.bilinear([1, 0, 1, 1]), [1, 0, 1, 1]],

    [SMAAUtils.bilinear([1, 1, 0, 0]), [1, 1, 0, 0]],
    [SMAAUtils.bilinear([1, 1, 0, 1]), [1, 1, 0, 1]],
    [SMAAUtils.bilinear([1, 1, 1, 0]), [1, 1, 1, 0]],
    [SMAAUtils.bilinear([1, 1, 1, 1]), [1, 1, 1, 1]],
  ]);
}
