import { BlendFunction } from '../../blending';
import { Effect } from '../../core';
export interface BokehEffectOptions {
    /** The blend function of this effect. Default is BlendFunction.NORMAL. */
    blendFunction: BlendFunction;
    /** The focus distance ratio, ranging from 0.0 to 1.0. Default is 0.5. */
    focus: number;
    /** Depth of field. An area in front of and behind the focal point that still appears sharp. Default is 0.02. */
    dof: number;
    /** Camera aperture scale. Bigger values for stronger blur and shallower depth of field. Default is 0.015. */
    aperture: number;
    /** The maximum blur strength. Default is 1.0. */
    maxBlur: number;
}
/**
 * A depth of field (bokeh) effect.
 *
 * Original shader code by Martins Upitis:
 *  http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
 */
export declare class BokehEffect extends Effect {
    constructor({ blendFunction, focus, dof, aperture, maxBlur, }?: Partial<BokehEffectOptions>);
}
