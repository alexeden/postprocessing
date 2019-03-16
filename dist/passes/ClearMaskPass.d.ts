import { WebGLRenderer } from 'three';
import { Pass } from '../core';
/**
 * A pass that disables the stencil test.
 */
export declare class ClearMaskPass extends Pass {
    constructor();
    /**
     * Disables the global stencil test.
     */
    render(renderer: WebGLRenderer): void;
}
