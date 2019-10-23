import { Scene, Camera, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from '../core';
/**
 * A mask pass.
 *
 * This pass requires that the input and output buffers have a stencil buffer.
 * You can enable the stencil buffer via the {@link EffectComposer} constructor.
 */
export declare class MaskPass extends Pass {
    /** Inverse flag */
    inverse: boolean;
    private clearPass;
    /**
     * Constructs a new mask pass.
     *
     * @param scene - The scene to render.
     * @param camera - The camera to use.
     */
    constructor(scene: Scene, camera: Camera);
    /**
     * Indicates whether this pass should clear the stencil buffer.
     */
    get clear(): boolean;
    /**
     * Enables or disables auto clear.
     */
    set clear(value: boolean);
    /**
     * Renders the effect.
     *
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, outputBuffer: WebGLRenderTarget): void;
}
