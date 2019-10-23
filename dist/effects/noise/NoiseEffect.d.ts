import { BlendFunction } from '../../blending';
import { Effect } from '../../core';
export interface NoiseEffectOptions {
    /** The blend function of this effect. */
    blendFunction: BlendFunction;
    /** Whether the noise should be multiplied with the input color. */
    premultiply: boolean;
}
export declare class NoiseEffect extends Effect {
    constructor({ blendFunction, premultiply, }?: Partial<NoiseEffectOptions>);
    /**
     * Indicates whether the noise should be multiplied with the input color.
     */
    get premultiply(): boolean;
    /**
     * Enables or disables noise premultiplication.
     * You'll need to call {@link EffectPass#recompile} after changing this value.
     */
    set premultiply(value: boolean);
}
