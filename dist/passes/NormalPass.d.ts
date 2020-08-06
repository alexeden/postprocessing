import { WebGLRenderTarget, Scene, Camera, WebGLRenderer } from 'three';
import { Pass } from '../core';
export interface NormalPassOptions {
    /**
     * The render texture resolution scale, relative to the screen render size.
     * default 0.5
     */
    resolutionScale?: number;
    /** A custom render target. */
    renderTarget?: WebGLRenderTarget;
}
/**
 * A pass that renders the normals of a given scene.
 */
export declare class NormalPass extends Pass {
    readonly scene: Scene;
    readonly camera: Camera;
    needsSwap: boolean;
    private renderPass;
    /** A render target that contains the scene normals. */
    private renderTarget;
    /** The original resolution */
    private resolution;
    /** The current resolution scale. */
    private resolutionScale;
    /**
     * Constructs a new normal pass.
     *
     * @param scene - The scene to render.
     * @param camera - The camera to use to render the scene.
     * @param [options] - The options.
     */
    constructor(scene: Scene, camera: Camera, options?: NormalPassOptions);
    /**
     * Returns the current resolution scale.
     */
    getResolutionScale(): number;
    /**
     * Sets the resolution scale.
     */
    setResolutionScale(scale: number): void;
    /**
     * Renders the scene normals.
     *
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
     * @param [delta] - The time between the last frame and the current one in seconds.
     * @param [stencilTest] - Indicates whether a stencil mask is active.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, outputBuffer: WebGLRenderTarget, delta?: number, stencilTest?: boolean): void;
    /**
     * Updates the size of this pass.
     */
    setSize(width: number, height: number): void;
}
