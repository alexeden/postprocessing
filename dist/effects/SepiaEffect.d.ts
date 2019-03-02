import { BlendFunction } from './blending/BlendFunction';
import { Effect } from './Effect';
export interface SepiaEffectOptions {
    /** The blend function of this effect. Default is BlendFunction.NORMAL. */
    blendFunction: BlendFunction;
    /** The intensity of the effect. Default is 1.0. */
    intensity: number;
}
/**
 * A sepia effect.
 */
export declare class SepiaEffect extends Effect {
    constructor({ blendFunction, intensity, }?: Partial<SepiaEffectOptions>);
}
