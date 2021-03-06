import { WebGLRenderTarget, WebGLRenderer } from 'three';
import { KernelSize } from '../materials';
import { Pass } from '../core';
export interface BlurPassOptions {
    /** The blur render height. */
    height: number;
    /** The blur kernel size. */
    kernelSize: KernelSize;
    /** The render texture resolution scale, relative to the main frame buffer size. */
    resolutionScale: number;
    /** The blur render width. */
    width: number;
}
/**
 * An efficient, incremental blur pass.
 */
export declare class BlurPass extends Pass {
    /**
     * An auto sizing flag that can be used for the render {@link BlurPass.width}
     * and {@link BlurPass.height}.
     *
     * It's recommended to set the height or the width to an absolute value for
     * consistent blur results across different devices and resolutions.
     */
    static readonly AUTO_SIZE = -1;
    /** A render target. */
    private readonly renderTargetX;
    /** A second render target. */
    private readonly renderTargetY;
    /** The current main render size. */
    private readonly originalSize;
    /** The absolute render resolution. */
    private readonly resolution;
    /** The current resolution scale. */
    private resolutionScale;
    /** A convolution shader material. */
    private readonly convolutionMaterial;
    /** A convolution shader material that uses dithering. */
    private readonly ditheredConvolutionMaterial;
    /** Whether the blurred result should also be dithered using noise. */
    dithering: boolean;
    /** Constructs a new blur pass. */
    constructor({ resolutionScale, width, height, kernelSize, }?: Partial<BlurPassOptions>);
    /** The current width of the internal render targets. */
    get width(): number;
    /**
     * Sets the render width.
     *
     * Use {@link BlurPass.AUTO_SIZE} to activate automatic sizing based on the
     * render height and aspect ratio.
     */
    set width(value: number);
    /** The current height of the internal render targets. */
    get height(): number;
    /**
     * Sets the render height.
     *
     * Use {@link BlurPass.AUTO_SIZE} to activate automatic sizing based on the
     * render width and aspect ratio.
     */
    set height(value: number);
    /** The current blur scale. */
    get scale(): any;
    /**
     * Sets the blur scale.
     *
     * This value influences the overall blur strength and should not be greater
     * than 1. For larger blurs please increase the {@link kernelSize}!
     *
     * Note that the blur strength is closely tied to the resolution. For a smooth
     * transition from no blur to full blur, set the width or the height to a high
     * enough value.
     */
    set scale(value: any);
    /** The kernel size. */
    get kernelSize(): KernelSize;
    /**
     * Sets the kernel size.
     *
     * Larger kernels require more processing power but scale well with larger
     * render resolutions.
     */
    set kernelSize(value: KernelSize);
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
