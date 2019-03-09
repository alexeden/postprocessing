import { PerspectiveCamera, Camera, Texture, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Initializable, Resizable, Disposable } from '../core';
import { Effect } from '../effects/Effect';
import { Pass } from './Pass';
/**
 * An effect pass.
 *
 * Use this pass to combine {@link Effect} instances.
 */
export declare class EffectPass extends Pass implements Disposable, Initializable, Resizable {
    private readonly mainCamera;
    /** The effects, sorted by attribute priority, DESC. */
    private readonly effects;
    /**
     * Indicates whether this pass should skip rendering.
     * Effects will still be updated, even if this flag is true.
     */
    private skipRendering;
    /** Indicates whether dithering is enabled. */
    private quantize;
    /** The amount of shader uniforms that this pass uses. */
    private uniforms;
    /** The amount of shader varyings that this pass uses. */
    private varyings;
    /** A time offset. Elapsed time will start at this value. */
    minTime: number;
    /** The maximum time. If the elapsed time exceeds this value, it will be reset. */
    maxTime: number;
    /**
     * Constructs a new effect pass.
     * The provided effects will be organized and merged for optimal performance.
     *
     * @param camera - The main camera. The camera's type and settings will be available to all effects.
     * @param effects - The effects that will be rendered by this pass.
     */
    constructor(mainCamera: Camera | PerspectiveCamera, ...effects: Effect[]);
    /**
     * Indicates whether dithering is enabled.
     * Color quantization reduces banding artifacts but degrades performance.
     */
    /**
    * Enables or disables dithering.
    * Note that some effects have their own dithering setting.
    */
    dithering: boolean;
    /**
     * Creates a compound shader material.
     *
     * @return The new material.
     */
    private createMaterial;
    /**
     * Destroys the current fullscreen shader material and builds a new one.
     *
     * Warning: This method performs a relatively expensive shader recompilation.
     */
    recompile(): void;
    /**
     * Returns the current depth texture.
     *
     * @return The current depth texture, or null if there is none.
     */
    getDepthTexture(): Texture;
    /**
     * Sets the depth texture.
     *
     * @param depthTexture - A depth texture.
     * @param depthPacking - The depth packing.
     */
    setDepthTexture(depthTexture: Texture | null, depthPacking?: number): void;
    /**
     * Renders the effect.
     *
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
     * @param delta - The time between the last frame and the current one in seconds.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, outputBuffer: WebGLRenderTarget, delta?: number): void;
    /**
     * Updates the size of this pass.
     *
     * @param width - The width.
     * @param height - The height.
     */
    setSize(width: number, height: number): void;
    /**
     * Performs initialization tasks.
     *
     * @param renderer - The renderer.
     * @param alpha - Whether the renderer uses the alpha channel or not.
     */
    initialize(renderer: WebGLRenderer, alpha: boolean): void;
    /**
     * Deletes disposable objects.
     *
     * This pass will be inoperative after this method was called!
     */
    dispose(): void;
}
