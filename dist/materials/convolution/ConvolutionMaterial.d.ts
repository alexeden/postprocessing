import { ShaderMaterial, Vector2 } from 'three';
/**
 * A kernel size enumeration.
 */
export declare enum KernelSize {
    /** A very small kernel that matches a 7x7 Gauss blur kernel. */
    VERY_SMALL = 0,
    /** A small kernel that matches a 15x15 Gauss blur kernel. */
    SMALL = 1,
    /** A medium sized kernel that matches a 23x23 Gauss blur kernel. */
    MEDIUM = 2,
    /** A large kernel that matches a 35x35 Gauss blur kernel. */
    LARGE = 3,
    /** A very large kernel that matches a 63x63 Gauss blur kernel. */
    VERY_LARGE = 4,
    /** A huge kernel that matches a 127x127 Gauss blur kernel. */
    HUGE = 5
}
/**
 * An optimised convolution shader material.
 *
 * This material supports dithering.
 *
 * Based on the GDC2003 Presentation by Masaki Kawase, Bunkasha Games:
 *  Frame Buffer Postprocessing Effects in DOUBLE-S.T.E.A.L (Wreckless)
 * and an article by Filip Strugar, Intel:
 *  An investigation of fast real-time GPU-based image blur algorithms
 *
 * Further modified according to Apple's
 * [Best Practices for Shaders](https://goo.gl/lmRoM5).
 */
export declare class ConvolutionMaterial extends ShaderMaterial {
    /**
     * The current kernel size.
     */
    kernelSize: KernelSize;
    /**
     * Constructs a new convolution material.
     * @param [texelSize] - The absolute screen texel size.
     */
    constructor(texelSize?: Vector2);
    /**
     * Returns the kernel.
     */
    getKernel(): Float32Array;
    /**
     * Sets the texel size.
     * @param x - The texel width.
     * @param y - The texel height.
     */
    setTexelSize(x: number, y: number): void;
}
