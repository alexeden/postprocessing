import { Vector2 } from 'three';
import { BlendFunction } from '../../blending';
import { Effect } from '../../core';
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
    get offset(): Vector2;
    set offset(value: Vector2);
}
