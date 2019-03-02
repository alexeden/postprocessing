import { Uniform } from 'three';
import { BlendFunction } from './blending/BlendFunction';
import { EffectAttribute, EffectName } from './lib';
import { Effect } from './Effect';

import fragment from './glsl/bokeh/shader.frag';

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
 * A depth of field (bokeh) shader effect.
 *
 * Original shader code by Martins Upitis:
 *  http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
 */
export class BokehEffect extends Effect {
  constructor(
    {
      blendFunction = BlendFunction.NORMAL,
      focus = 0.5,
      dof = 0.02,
      aperture = 0.015,
      maxBlur = 1.0,
    }: Partial<BokehEffectOptions> = { }
  ) {
    super(EffectName.Bokeh, fragment, {
      attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
      blendFunction,
      uniforms: new Map([
        ['focus', new Uniform(focus)],
        ['dof', new Uniform(dof)],
        ['aperture', new Uniform(aperture)],
        ['maxBlur', new Uniform(maxBlur)],
      ]),
    });
  }
}
