import { Scene, Camera, Material, WebGLRenderer, WebGLRenderTarget, DepthTexture } from 'three';
import { ClearPass } from './ClearPass';
import { Pass } from '../core';
export interface RenderPassOptions {
    /** An override material for the scene. */
    overrideMaterial: Material | null;
    /** An override clear alpha. */
    clearAlpha: number;
    /** Whether depth should be cleared explicitly. */
    clearDepth: boolean;
    /** Whether all buffers should be cleared. */
    clear: boolean;
}
/**
 * A pass that renders a given scene into the input buffer or to screen.
 * This pass uses a {@link ClearPass} to clear the target buffer.
 */
export declare class RenderPass extends Pass {
    readonly scene: Scene;
    readonly camera: Camera;
    readonly overrideMaterial: Material | null;
    private readonly clearPass;
    private depthTexture;
    /**
     * Constructs a new render pass.
     *
     * @param scene The scene to render.
     * @param camera The camera to use to render the scene.
     * @param options Additional options.
     */
    constructor(scene: Scene, camera: Camera, overrideMaterial?: Material | null);
    /**
     * Indicates whether the target buffer should be cleared before rendering.
     */
    get clear(): boolean;
    /**
     * Enables or disables auto clear.
     */
    set clear(value: boolean);
    /**
     * Returns the clear pass.
     */
    getClearPass(): ClearPass;
    /**
     * Returns the current depth texture.
     */
    getDepthTexture(): DepthTexture | null;
    /**
     * Sets the depth texture.
     *
     * The provided texture will be attached to the input buffer unless this pass
     * renders to screen.
     */
    setDepthTexture(depthTexture: DepthTexture, depthPacking?: number): void;
    /**
     * Renders the scene.
     *
     * @param renderer The renderer.
     * @param inputBuffer A frame buffer that contains the result of the previous pass.
     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, outputBuffer: WebGLRenderTarget): void;
}
