import { Box2, Vector2 } from 'three';
import { RawImageData } from '../../RawImageData';
export declare class SMAAUtils {
    /**
     * A box.
     */
    private static readonly b0;
    /**
     * A box.
     */
    private static readonly b1;
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
    static readonly bilinear: (e: number[]) => number;
    /**
     * Computes the delta distance to add in the last step of searches to the left.
     * @param left - The left edge combination.
     * @param top - The top edge combination.
     * @return The left delta distance.
     */
    static readonly deltaLeft: (left: number[], top: number[]) => number;
    /**
     * Computes the delta distance to add in the last step of searches to the right.
     * @param left - The left edge combination.
     * @param top - The top edge combination.
     * @return The right delta distance.
     */
    static readonly deltaRight: (left: number[], top: number[]) => number;
    /**
     * Linearly interpolates between two values.
     * @param a - The initial value.
     * @param b - The target value.
     * @param p - The interpolation value.
     * @return The interpolated value.
     */
    static readonly lerp: (a: number, b: number, p: number) => number;
    /**
     * Clamps a value to the range [0, 1].
     * @param a - The value.
     * @return The saturated value.
     */
    static readonly saturate: (a: number) => number;
    /**
     * A smoothing static readonly for =  small U-patterns=> .
     *
     * @param d - A smoothing factor.
     * @param b - The area that should be smoothed.
     * @return The smoothed area.
     */
    static readonly smoothArea: (d: number, b: Box2) => Box2;
    /**
     * Calculates the area under the line p1 -> p2, for the pixels (x, x + 1).
     *
     * @param p1 - The starting point of the line.
     * @param p2 - The ending point of the line.
     * @param x - The pixel index.
     * @param result - A target vector to store the area in.
     * @return The area.
     */
    static readonly calculateOrthogonalArea: (p1: Vector2, p2: Vector2, x: number, result: Vector2) => Vector2;
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
    static readonly calculateOrthogonalAreaForPattern: (pattern: number, left: number, right: number, offset: number, result: Vector2) => Vector2;
    /**
     * Determines whether the given pixel is inside the specified area.
     *
     * @param p1 - The lower bounds of the area.
     * @param p2 - The upper bounds of the area.
     * @param x - The X-coordinates.
     * @param y - The Y-coordinates.
     * @return Whether the pixel lies inside the area.
     */
    static readonly isInsideArea: (p1: Vector2, p2: Vector2, x: number, y: number) => boolean;
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
    static readonly calculateDiagonalAreaForPixel: (p1: Vector2, p2: Vector2, pX: number, pY: number) => number;
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
    static readonly calculateDiagonalArea: (pattern: number, p1: Vector2, p2: Vector2, left: number, offset: Float32Array, result: Vector2) => Vector2;
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
    static readonly calculateDiagonalAreaForPattern: (pattern: number, left: number, right: number, offset: Float32Array, result: Vector2) => Vector2;
    /**
     * Calculates orthogonal or diagonal patterns for a given offset.
     *
     * @param patterns - The patterns to assemble.
     * @param offset - A pattern offset. Diagonal offsets are pairs.
     * @param orthogonal - Whether the patterns are orthogonal or diagonal.
     */
    static readonly generatePatterns: (patterns: RawImageData[], offset: number | Float32Array, orthogonal: boolean) => void;
}
