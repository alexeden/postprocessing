/**
 * The orthogonal texture size.
 */
export const ORTHOGONAL_SIZE = 16;

/**
 * The diagonal texture size.
 */
export const DIAGONAL_SIZE = 20;

/**
 * The number of samples for calculating areas in the diagonal textures.
 * Diagonal areas are calculated using brute force sampling.
 */
export const DIAGONAL_SAMPLES = 30;

/**
 * The maximum distance for smoothing U-shapes.
 */
export const SMOOTH_MAX_DISTANCE = 32;

/**
 * Subsampling offsets for orthogonal areas.
 */
export const ORTHOGONAL_SUBSAMPLING_OFFSETS = new Float32Array([
  0.0,
  -0.25,
  0.25,
  -0.125,
  0.125,
  -0.375,
  0.375,
]);

/**
 * Subsampling offset pairs for diagonal areas.
 */
export const DIAGONAL_SUBSAMPLING_OFFSETS = [
  new Float32Array([0.0, 0.0]),
  new Float32Array([0.25, -0.25]),
  new Float32Array([-0.25, 0.25]),
  new Float32Array([0.125, -0.125]),
  new Float32Array([-0.125, 0.125]),
];

/**
 * Orthogonal pattern positioning coordinates.
 * Used for placing each pattern subtexture into a specific spot.
 */
export const ORTHOGONAL_EDGES = [
  new Uint8Array([0, 0]),
  new Uint8Array([3, 0]),
  new Uint8Array([0, 3]),
  new Uint8Array([3, 3]),

  new Uint8Array([1, 0]),
  new Uint8Array([4, 0]),
  new Uint8Array([1, 3]),
  new Uint8Array([4, 3]),

  new Uint8Array([0, 1]),
  new Uint8Array([3, 1]),
  new Uint8Array([0, 4]),
  new Uint8Array([3, 4]),

  new Uint8Array([1, 1]),
  new Uint8Array([4, 1]),
  new Uint8Array([1, 4]),
  new Uint8Array([4, 4]),
];

/**
 * Diagonal pattern positioning coordinates.
 * Used for placing each pattern subtexture into a specific spot.
 */
export const DIAGONAL_EDGES = [
  new Uint8Array([0, 0]),
  new Uint8Array([1, 0]),
  new Uint8Array([0, 2]),
  new Uint8Array([1, 2]),

  new Uint8Array([2, 0]),
  new Uint8Array([3, 0]),
  new Uint8Array([2, 2]),
  new Uint8Array([3, 2]),

  new Uint8Array([0, 1]),
  new Uint8Array([1, 1]),
  new Uint8Array([0, 3]),
  new Uint8Array([1, 3]),

  new Uint8Array([2, 1]),
  new Uint8Array([3, 1]),
  new Uint8Array([2, 3]),
  new Uint8Array([3, 3]),
];
