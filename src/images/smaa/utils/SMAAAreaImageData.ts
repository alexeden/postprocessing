// tslint:disable cyclomatic-complexity
import { Vector2 } from 'three';
import { RawImageData } from '../../RawImageData';
import {
  ORTHOGONAL_SIZE,
  ORTHOGONAL_SUBSAMPLING_OFFSETS,
  DIAGONAL_SIZE,
  ORTHOGONAL_EDGES,
  DIAGONAL_SUBSAMPLING_OFFSETS,
  DIAGONAL_EDGES,
} from './constants';
import { SMAAUtils } from './utils';

/**
 * Assembles orthogonal or diagonal patterns into the final area image.
 * @param base - A base position.
 * @param patterns - The patterns to assemble.
 * @param edges - Edge coordinate pairs, used for positioning.
 * @param size - The pattern size.
 * @param orthogonal - Whether the patterns are orthogonal or diagonal.
 * @param target - The target image data.
 */
const assemble = (
  base: Vector2,
  patterns: RawImageData[],
  edges: Uint8Array[],
  size: number,
  orthogonal: boolean,
  target: RawImageData
) => {
  const p = new Vector2();

  const dstData = target.data;
  const dstWidth = target.width;

  let i;
  let l;
  let x;
  let y;
  let c;
  let d;

  let edge;
  let pattern;
  let srcData;
  let srcWidth;

  // tslint:disable-next-line:ban-comma-operator
  for (i = 0, l = patterns.length; i < l; ++i) {
    edge = edges[i];
    pattern = patterns[i];
    srcData = pattern.data;
    srcWidth = pattern.width;

    for (y = 0; y < size; ++y) {
      for (x = 0; x < size; ++x) {
        p.fromArray(Array.from(edge)).multiplyScalar(size);
        p.add(base);
        p.x += x;
        p.y += y;

        c = (p.y * dstWidth + p.x) * 2;

        /* The texture coordinates of orthogonal patterns are compressed
        quadratically to reach longer distances for a given texture size. */
        d = orthogonal ? ((y * y * srcWidth + x * x) * 2) :
          ((y * srcWidth + x) * 2);

        dstData[c] = srcData[d];
        dstData[c + 1] = srcData[d + 1];
      }
    }
  }
};

/**
 * SMAA area image data.
 *
 * This texture allows to obtain the area for a certain pattern and distances
 * to the left and to the right of the identified line.
 *
 * Based on the official python scripts:
 *  https://github.com/iryoku/smaa/tree/master/Scripts
 */
export class SMAAAreaImageData {
  /**
   * Creates a new area image.
   * @return The generated image data.
   */
  static generate(): RawImageData {
    const width = 2 * 5 * ORTHOGONAL_SIZE;
    const height = ORTHOGONAL_SUBSAMPLING_OFFSETS.length * 5 * ORTHOGONAL_SIZE;
    const data = new Uint8ClampedArray(width * height * 2);
    const result = new RawImageData(width, height, data, 2);
    const orthogonalPatternSize = Math.pow(ORTHOGONAL_SIZE - 1, 2) + 1;
    const diagonalPatternSize = DIAGONAL_SIZE;
    const orthogonalPatterns = [];
    const diagonalPatterns = [];
    const base = new Vector2();

    let i;
    let l;

    // Prepare 16 image data sets for the orthogonal and diagonal subtextures.
    for (i = 0; i < 16; ++i) {
      orthogonalPatterns.push(
        new RawImageData(
          orthogonalPatternSize,
          orthogonalPatternSize,
          new Uint8ClampedArray(orthogonalPatternSize * orthogonalPatternSize * 2),
          2
        )
      );

      diagonalPatterns.push(
        new RawImageData(
          diagonalPatternSize,
          diagonalPatternSize,
          new Uint8ClampedArray(diagonalPatternSize * diagonalPatternSize * 2),
          2
        )
      );
    }

    // tslint:disable-next-line:ban-comma-operator
    for (i = 0, l = ORTHOGONAL_SUBSAMPLING_OFFSETS.length; i < l; ++i) {
      // Generate 16 orthogonal patterns for each offset.
      SMAAUtils.generatePatterns(orthogonalPatterns, ORTHOGONAL_SUBSAMPLING_OFFSETS[i], true);

      // Assemble the orthogonal patterns and place them on the left side.
      base.set(0, 5 * ORTHOGONAL_SIZE * i);
      assemble(base, orthogonalPatterns, ORTHOGONAL_EDGES, ORTHOGONAL_SIZE, true, result);
    }

    // tslint:disable-next-line:ban-comma-operator
    for (i = 0, l = DIAGONAL_SUBSAMPLING_OFFSETS.length; i < l; ++i) {
      // Generate 16 diagonal patterns for each offset.
      SMAAUtils.generatePatterns(diagonalPatterns, DIAGONAL_SUBSAMPLING_OFFSETS[i], false);

      // Assemble the diagonal patterns and place them on the right side.
      base.set(5 * ORTHOGONAL_SIZE, 4 * DIAGONAL_SIZE * i);
      assemble(base, diagonalPatterns, DIAGONAL_EDGES, DIAGONAL_SIZE, false, result);
    }

    return result;
  }
}
