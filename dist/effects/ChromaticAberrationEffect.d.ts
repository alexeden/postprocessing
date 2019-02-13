import { Vector2 } from 'three';
import { BlendFunction } from './blending/BlendFunction';
import { Effect } from './Effect';
export interface ChromaticAberrationEffectOptions {
    blendFunction: BlendFunction;
    offset: Vector2;
}
/**
 * A chromatic aberration effect.
 */
export declare class ChromaticAberrationEffect extends Effect {
    constructor(partialOptions?: Partial<ChromaticAberrationEffectOptions>);
    /**
     * The color offset.
     */
    offset: Vector2;
}
