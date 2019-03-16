import { WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from '../core';
import { PostprocessingMaterial } from '../materials';
/**
 * A shader pass. Renders any shader material as a fullscreen effect.
 *
 * This pass should not be used to create multiple chained effects. For a more
 * efficient solution, please refer to the {@link EffectPass}.
 */
export declare class ShaderPass extends Pass {
    /**
     * Constructs a new shader pass.
     *
     * @param material - A shader material.
     * @param input - The name of the input buffer uniform.
     */
    constructor(material: PostprocessingMaterial, input?: string);
    /**
     * Sets the name of the input buffer uniform.
     *
     * Most fullscreen materials modify texels from an input texture. This pass
     * automatically assigns the main input buffer to the uniform identified by
     * the given name.
     *
     * @param input - The name of the input buffer uniform.
     */
    setInput(input: string): void;
    /**
     * Renders the effect.
     *
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, outputBuffer: WebGLRenderTarget): void;
}
