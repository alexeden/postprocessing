import { Color, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from '../core';
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
    color: boolean;
    depth: boolean;
    stencil: boolean;
    /** Used to save the original clear color of the renderer. */
    private static color;
    /**
     * An override clear color.
     */
    overrideClearColor: Color | null;
    /**
     * An override clear alpha.
     */
    overrideClearAlpha: number;
    /**
     * Constructs a new clear pass.
     *
     * @param color - Determines whether the color buffer should be cleared.
     * @param depth - Determines whether the depth buffer should be cleared.
     * @param stencil - Determines whether the stencil buffer should be cleared.
     */
    constructor(color?: boolean, depth?: boolean, stencil?: boolean);
    /**
     * Clears the input buffer or the screen.
     *
     * @param renderer - The renderer.
     * @param inputBuffer - A frame buffer that contains the result of the previous pass.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget | null): void;
}
