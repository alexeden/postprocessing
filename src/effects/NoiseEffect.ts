import { BlendFunction } from './blending/BlendFunction';
import { Effect } from './Effect';
import fragment from './glsl/noise.frag';
import { EffectName } from './lib';

export interface NoiseEffectOptions {
  /** The blend function of this effect. */
  blendFunction: BlendFunction;
  /** Whether the noise should be multiplied with the input color. */
  premultiply: boolean;
}

export class NoiseEffect extends Effect {
  constructor(
    {
      blendFunction = BlendFunction.SCREEN,
      premultiply = false,
    }: Partial<NoiseEffectOptions> = { }
  ) {
    super(EffectName.Noise, fragment, { blendFunction });
    this.premultiply = premultiply;
  }

  /**
   * Indicates whether the noise should be multiplied with the input color.
   */
  get premultiply() {
    return this.defines.has('PREMULTIPLY');
  }

  /**
   * Enables or disables noise premultiplication.
   * You'll need to call {@link EffectPass#recompile} after changing this value.
   */
  set premultiply(value: boolean) {
    value ? this.defines.set('PREMULTIPLY', '1') : this.defines.delete('PREMULTIPLY');
  }
}
