import { ShaderMaterial, Vector2 } from 'three';
/**
 * A material that detects edges in a color texture.
 * Mainly used for Subpixel Morphological Antialiasing.
 */
export declare class ColorEdgesMaterial extends ShaderMaterial {
    /**
     * Constructs a new color edges material.
     * @param texelSize - The absolute screen texel size.
     */
    constructor(texelSize?: Vector2);
    /**
     * Sets the edge detection sensitivity.
     *
     * A lower value results in more edges being detected at the expense of
     * performance.
     *
     * 0.1 is a reasonable value, and allows to catch most visible edges.
     * 0.05 is a rather overkill value, that allows to catch 'em all.
     *
     * If temporal supersampling is used, 0.2 could be a reasonable value,
     * as low contrast edges are properly filtered by just 2x.
     *
     * @param threshold - The edge detection sensitivity. Range: [0.05, 0.5].
     */
    setEdgeDetectionThreshold(threshold: number): void;
}
