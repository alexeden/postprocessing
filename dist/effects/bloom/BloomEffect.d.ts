import { WebGLRenderTarget, WebGLRenderer } from 'three';
import { KernelSize } from '../../materials';
import { BlendFunction } from '../../blending';
import { Effect } from '../../core';
export interface BloomEffectOptions {
    /** The blend function of this effect. */
    blendFunction: BlendFunction;
    /** The luminance distinction factor. Raise this value to bring out the brighter elements in the scene. */
    distinction: number;
    /** The render texture resolution scale, relative to the main frame buffer size. */
    resolutionScale: number;
    /** The blur kernel size. */
    kernelSize: KernelSize;
}
/**
 * A bloom effect.
 *
 * This effect uses the fast Kawase convolution technique and a luminance filter
 * to blur bright highlights.
 */
export declare class BloomEffect extends Effect {
    /** A render target. */
    private readonly renderTarget;
    /** A blur pass. */
    private readonly blurPass;
    /** THe original resolution. */
    private readonly resolution;
    /** A luminance shader pass. */
    private readonly luminancePass;
    /**
     * Constructs a new bloom effect.
     */
    constructor({ blendFunction, distinction, resolutionScale, kernelSize, }?: Partial<BloomEffectOptions>);
    /**
     * A texture that contains the intermediate result of this effect.
     *
     * This texture will be applied to the scene colors unless the blend function
     * is set to `SKIP`.
     */
    get texture(): import("three").Texture;
    /** Indicates whether dithering is enabled. */
    get dithering(): boolean;
    /** Enables or disables dithering. */
    set dithering(value: boolean);
    /** The blur kernel size. */
    get kernelSize(): KernelSize;
    set kernelSize(value: KernelSize);
    /** The luminance distinction factor. */
    get distinction(): any;
    set distinction(value: any);
    /** Returns the current resolution scale. */
    getResolutionScale(): number;
    /** Sets the resolution scale. */
    setResolutionScale(scale: number): void;
    /**
     * Updates this effect.
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     */
    update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget): void;
    /**
     * Updates the size of internal render targets.
     */
    setSize(width: number, height: number): void;
    /**
     * Performs initialization tasks.
     * @param renderer - The renderer.
     * @param alpha - Whether the renderer uses the alpha channel or not.
     */
    initialize(renderer: WebGLRenderer, alpha: boolean): void;
}
