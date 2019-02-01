import { Color, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from './Pass';
export interface ClearPassOptions {
    /** An override clear alpha. */
    clearAlpha: number;
    /** An override clear color. */
    clearColor: Color | null;
}
/**
 * A pass that clears the input buffer or the screen.
 *
 * You can prevent specific bits from being cleared by setting either the
 * `autoClearColor`, `autoClearStencil` or `autoClearDepth` properties of the renderer
 * to `false`.
 */
export declare class ClearPass extends Pass {
    /** Used for saving the original clear color of the renderer. */
    private static color;
    clearColor: Color | null;
    clearAlpha: number;
    /**
     * Constructs a new clear pass.
     * @param options - Additional options.
     */
    constructor(partialOptions?: Partial<ClearPassOptions>);
    /**
     * Clears the input buffer or the screen.
     *
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget): void;
}
