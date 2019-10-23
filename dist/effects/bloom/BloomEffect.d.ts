import { WebGLRenderTarget, WebGLRenderer } from 'three';
import { KernelSize, LuminanceMaterial } from '../../materials';
import { BlendFunction } from '../../blending';
import { Effect } from '../../core';
export interface BloomEffectOptions {
    /** The blend function of this effect. */
    blendFunction: BlendFunction;
    /** The luminance threshold. Raise this value to mask out darker elements in the scene. Range is [0, 1]. */
    luminanceThreshold: number;
    /** Controls the smoothness of the luminance threshold. Range is [0, 1]. */
    luminanceSmoothing: number;
    /** The render width. */
    width: number;
    /** The render height. */
    height: number;
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
    /**
     * A blur pass.
     * Do not adjust the width or height of this pass directly. Use
     * {@link width} or {@link height} instead.
     */
    private readonly blurPass;
    /**
     * A luminance shader pass.
     * You may disable this pass to deactivate luminance filtering.
     */
    private readonly luminancePass;
    /**
     * Constructs a new bloom effect.
     */
    constructor({ blendFunction, luminanceThreshold, luminanceSmoothing, width, height, kernelSize, }?: Partial<BloomEffectOptions>);
    /**
     * A texture that contains the intermediate result of this effect.
     *
     * This texture will be applied to the scene colors unless the blend function is set to `SKIP`.
     */
    get texture(): import("three").Texture;
    /** The luminance material. */
    get luminanceMaterial(): LuminanceMaterial;
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
    /**
     * Updates this effect.
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     */
    update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget): void;
    /**
     * Updates the size of internal render targets.
     *
     * @param width - The width.
     * @param height - The height.
     */
    setSize(width: number, height: number): void;
    /**
     * Performs initialization tasks.
     * @param renderer - The renderer.
     * @param alpha - Whether the renderer uses the alpha channel or not.
     */
    initialize(renderer: WebGLRenderer, alpha: boolean): void;
}
