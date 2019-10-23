import { WebGLRenderTarget, WebGLRenderer } from 'three';
import { KernelSize } from '../materials';
import { Pass } from '../core';
export interface BlurPassOptions {
    /** The render texture resolution scale, relative to the main frame buffer size. */
    resolutionScale: number;
    /** The blur kernel size. */
    kernelSize: KernelSize;
}
/**
 * An efficient, incremental blur pass.
 *
 * Note: This pass allows the input and output buffer to be the same.
 */
export declare class BlurPass extends Pass {
    /** A render target. */
    private readonly renderTargetX;
    /** A second render target. */
    private readonly renderTargetY;
    /** The original resolution. */
    private readonly resolution;
    /** The current resolution scale. */
    private resolutionScale;
    /** A convolution shader material. */
    private readonly convolutionMaterial;
    /** A convolution shader material that uses dithering. */
    private readonly ditheredConvolutionMaterial;
    /** Whether the blurred result should also be dithered using noise. */
    dithering: boolean;
    /**
     * Constructs a new blur pass.
     */
    constructor({ resolutionScale, kernelSize, }?: Partial<BlurPassOptions>);
    /** The absolute width of the internal render targets. */
    get width(): number;
    /** The absolute height of the internal render targets. */
    get height(): number;
    /** The kernel size. */
    get kernelSize(): KernelSize;
    /** Sets the kernel size. */
    set kernelSize(value: KernelSize);
    /** Returns the current resolution scale. */
    getResolutionScale(): number;
    /** Sets the resolution scale. */
    setResolutionScale(scale: number): void;
    /**
     * Blurs the input buffer and writes the result to the output buffer. The
     * input buffer remains intact, unless its also the output buffer.
     *
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, outputBuffer: WebGLRenderTarget): void;
    /**
     * Updates the size of this pass.
     */
    setSize(width: number, height: number): void;
    /**
     * Performs initialization tasks.
     *
     * @param renderer - The renderer.
     * @param alpha - Whether the renderer uses the alpha channel or not.
     */
    initialize(renderer: WebGLRenderer, alpha: boolean): void;
}
