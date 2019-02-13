import { ShaderMaterial, Vector2 } from 'three';
/**
 * Subpixel Morphological Antialiasing.
 * This material computes weights for detected edges.
 */
export declare class SMAAWeightsMaterial extends ShaderMaterial {
    /**
     * Constructs a new SMAA weights material.
     * @param [texelSize] - The absolute screen texel size.
     */
    constructor(texelSize?: Vector2);
    /**
     * Sets the maximum amount of steps performed in the horizontal/vertical
     * pattern searches, at each side of the pixel.
     *
     * In number of pixels, it's actually the double. So the maximum line length
     * perfectly handled by, for example 16, is 64 (perfectly means that longer
     * lines won't look as good, but are still antialiased).
     *
     * @param steps - The search steps. Range: [0, 112].
     */
    setOrthogonalSearchSteps(steps: number): void;
}
