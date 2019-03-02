import { WebGLRenderTarget, WebGLRenderer } from 'three';
import { Pass } from './Pass';
/**
 * A pass that renders the result from a previous pass to another render target.
 */
export declare class SavePass extends Pass {
    readonly resize: boolean;
    readonly needsSwap = false;
    readonly renderTarget: WebGLRenderTarget;
    /**
     * Constructs a new save pass.
     *
     * @param renderTarget - A render target.
     * @param resize - Indicates whether the render target should be resized automatically.
     */
    constructor(renderTarget?: WebGLRenderTarget, resize?: boolean);
    /**
     * Saves the input buffer.
     */
    render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget): void;
    /**
     * Updates the size of this pass.
     */
    setSize(width: number, height: number): void;
}
