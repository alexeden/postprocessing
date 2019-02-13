/**
 * The orthogonal texture size.
 */
export declare const ORTHOGONAL_SIZE = 16;
/**
 * The diagonal texture size.
 */
export declare const DIAGONAL_SIZE = 20;
/**
 * The number of samples for calculating areas in the diagonal textures.
 * Diagonal areas are calculated using brute force sampling.
 */
export declare const DIAGONAL_SAMPLES = 30;
/**
 * The maximum distance for smoothing U-shapes.
 */
export declare const SMOOTH_MAX_DISTANCE = 32;
/**
 * Subsampling offsets for orthogonal areas.
 */
export declare const ORTHOGONAL_SUBSAMPLING_OFFSETS: Float32Array;
/**
 * Subsampling offset pairs for diagonal areas.
 */
export declare const DIAGONAL_SUBSAMPLING_OFFSETS: Float32Array[];
/**
 * Orthogonal pattern positioning coordinates.
 * Used for placing each pattern subtexture into a specific spot.
 */
export declare const ORTHOGONAL_EDGES: Uint8Array[];
/**
 * Diagonal pattern positioning coordinates.
 * Used for placing each pattern subtexture into a specific spot.
 */
export declare const DIAGONAL_EDGES: Uint8Array[];
