import { BlendFunction } from './blending/BlendFunction';
import { Effect } from './Effect';
import { EffectName } from './lib';

import fragment from './glsl/color-average/shader.frag';

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
