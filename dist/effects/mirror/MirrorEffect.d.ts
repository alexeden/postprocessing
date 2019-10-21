import { BlendFunction } from '../../blending';
import { Effect } from '../../core';
export interface MirrorEffectOptions {
    /** The blend function of this effect. Default is BlendFunction.NORMAL. */
    blendFunction: BlendFunction;
    side: number;
}
export declare class MirrorEffect extends Effect {
    constructor({ blendFunction, side, }?: Partial<MirrorEffectOptions>);
}
