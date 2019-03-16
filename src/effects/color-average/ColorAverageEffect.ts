import { BlendFunction } from '../../blending';
import { EffectName, Effect } from '../../core';

import fragment from './glsl/color-average.frag';

/**
 * A color average effect.
 */
export class ColorAverageEffect extends Effect {
  constructor(
    blendFunction = BlendFunction.NORMAL
  ) {
    super(EffectName.ColorAverage, fragment, { blendFunction });
  }
}
