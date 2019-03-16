import { Uniform } from 'three';
import { BlendFunction } from './blending/BlendFunction';
import { Effect } from './Effect';
import { EffectName } from './lib';

import fragment from './glsl/sepia.frag';

export interface SepiaEffectOptions {
  /** The blend function of this effect. Default is BlendFunction.NORMAL. */
  blendFunction: BlendFunction;
  /** The intensity of the effect. Default is 1.0. */
  intensity: number;
}

/**
 * A sepia effect.
 */
export class SepiaEffect extends Effect {
  constructor(
    {
      blendFunction = BlendFunction.NORMAL,
      intensity = 1.0,
    }: Partial<SepiaEffectOptions> = { }
  ) {
    super(EffectName.Sepia, fragment, {
      blendFunction,
      uniforms: new Map([
        ['intensity', new Uniform(intensity)],
      ]),
    });
  }
}
