import { Uniform } from 'three';
import { BlendFunction } from './BlendFunction';
/** A blend mode. */
export declare class BlendMode {
    readonly blendFunction: BlendFunction;
    /** The opacity of the color that will be blended with the base color. */
    readonly opacity: Uniform;
    /**
     * Constructs a new blend mode.
     *
     * @param blendFunction - The blend function to use.
     * @param opacity - The opacity of the color that will be blended with the base color.
     */
    constructor(blendFunction: BlendFunction, opacity?: number);
    /** Returns the blend function shader code, or null for `SKIP` blend function. */
    getShaderCode(): FragmentShader | null;
}
