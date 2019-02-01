import { Scene, Camera, Material, WebGLRenderer, WebGLRenderTarget } from 'three';
import { ClearPass } from './ClearPass';
import { Pass } from './Pass';
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
 * A pass that renders a given scene directly on screen or into the read buffer
 * for further processing.
 */
export declare class RenderPass extends Pass {
    readonly scene: Scene;
    readonly camera: Camera;
    readonly clearDepth: boolean;
    readonly clearPass: ClearPass;
    readonly overrideMaterial: Material | null;
    /**
     * Indicates whether the color, depth and stencil buffers should be cleared.
     *
     * Even with clear set to true you can prevent specific buffers from being
     * cleared by setting either the autoClearColor, autoClearStencil or
     * autoClearDepth properties of the renderer to false.
     */
    readonly clear: boolean;
    /**
     * Constructs a new render pass.
     *
     * @param scene The scene to render.
     * @param camera The camera to use to render the scene.
     * @param options Additional options.
     */
    constructor(scene: Scene, camera: Camera, partialOptions?: Partial<RenderPassOptions>);
    /**
     * Renders the scene.
     *
     * @param renderer The renderer.
     * @param inputBuffer A frame buffer that contains the result of the previous pass.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget): void;
}
