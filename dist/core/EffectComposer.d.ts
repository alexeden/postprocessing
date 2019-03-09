import { WebGLRenderTarget, WebGLRenderer } from 'three';
import { Pass } from '../passes';
import { Disposable } from './Disposable';
import { Resizable } from './Resizable';
interface EffectComposerOptions {
    /**
     * Whether the main render targets should have a depth buffer.
     */
    depthBuffer: boolean;
    /**
     * Whether the main render targets should have a stencil buffer.
     */
    stencilBuffer: boolean;
}
/**
 * The EffectComposer may be used in place of a normal WebGLRenderer.
 *
 * The auto clear behaviour of the provided renderer will be disabled to prevent
 * unnecessary clear operations.
 *
 * It is common practice to use a {@link RenderPass} as the first pass to
 * automatically clear the buffers and render a scene for further processing.
 */
export declare class EffectComposer implements Disposable, Resizable {
    private renderer;
    /**
     * The input buffer.
     *
     * Reading from and writing to the same render target should be avoided.
     * Therefore, two seperate yet identical buffers are used.
     */
    inputBuffer: WebGLRenderTarget | null;
    /**
     * The output buffer.
     */
    outputBuffer: WebGLRenderTarget | null;
    /**
     * A copy pass used for copying masked scenes.
     */
    private copyPass;
    private depthTexture;
    /**
     * The passes.
     */
    private passes;
    /**
     * Constructs a new effect composer.
     * @param renderer- The renderer that should be used.
     * @param options - The options.
     */
    constructor(renderer: WebGLRenderer, partialOptions?: Partial<EffectComposerOptions>);
    /**
     * Returns the WebGL renderer.
     */
    getRenderer(): WebGLRenderer;
    /**
     * Replaces the current renderer with the given one. The DOM element of the
     * current renderer will automatically be removed from its parent node and the
     * DOM element of the new renderer will take its place.
     *
     * The auto clear mechanism of the provided renderer will be disabled.
     *
     * @param renderer New renderer.
     * @return The old renderer.
     */
    replaceRenderer(renderer: WebGLRenderer): WebGLRenderer | null;
    /**
     * Creates a depth texture attachment that will be provided to all passes.
     *
     * Note: When a shader reads from a depth texture and writes to a render
     * target that uses the same depth texture attachment, the depth information
     * will be lost. This happens even if `depthWrite` is disabled.
     *
     * @return The depth texture.
     */
    private createDepthTexture;
    /**
     * Creates a new render target by replicating the renderer's canvas.
     *
     * The created render target uses a linear filter for texel minification and
     * magnification. Its render texture format depends on whether the renderer
     * uses the alpha channel. Mipmaps are disabled.
     *
     * @param depthBuffer - Whether the render target should have a depth buffer.
     * @param stencilBuffer - Whether the render target should have a stencil buffer.
     * @return A new render target that equals the renderer's canvas.
     */
    createBuffer(depthBuffer: boolean, stencilBuffer: boolean): WebGLRenderTarget;
    /**
     * Adds a pass, optionally at a specific index.
     *
     * @param pass - A new pass.
     * @param index - An index at which the pass should be inserted.
     */
    addPass(pass: Pass, index?: number): void;
    /**
     * Removes a pass.
     */
    removePass(pass: Pass): void;
    /**
     * Renders all enabled passes in the order in which they were added.
     * @param delta - The time between the last frame and the current one in seconds.
     */
    render(delta: number): void;
    /**
     * Sets the size of the buffers and the renderer's output canvas.
     *
     * Every pass will be informed of the new size. It's up to each pass how that
     * information is used.
     *
     * If no width or height is specified, the render targets and passes will be
     * updated with the current size of the renderer.
     */
    setSize(width?: number, height?: number): void;
    /**
     * Resets this composer by deleting all passes and creating new buffers.
     */
    reset(): void;
    /**
     * Destroys this composer and all passes.
     *
     * This method deallocates all disposable objects created by the passes. It
     * also deletes the main frame buffers of this composer.
     */
    dispose(): void;
}
export {};
