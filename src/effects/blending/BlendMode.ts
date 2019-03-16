import { Uniform } from 'three';
import { BlendFunction } from './BlendFunction';

import addBlendFunction from './glsl/add.frag';
import alphaBlendFunction from './glsl/alpha.frag';
import averageBlendFunction from './glsl/average.frag';
import colorBurnBlendFunction from './glsl/color-burn.frag';
import colorDodgeBlendFunction from './glsl/color-dodge.frag';
import darkenBlendFunction from './glsl/darken.frag';
import differenceBlendFunction from './glsl/difference.frag';
import exclusionBlendFunction from './glsl/exclusion.frag';
import lightenBlendFunction from './glsl/lighten.frag';
import multiplyBlendFunction from './glsl/multiply.frag';
import divideBlendFunction from './glsl/divide.frag';
import negationBlendFunction from './glsl/negation.frag';
import normalBlendFunction from './glsl/normal.frag';
import overlayBlendFunction from './glsl/overlay.frag';
import reflectBlendFunction from './glsl/reflect.frag';
import screenBlendFunction from './glsl/screen.frag';
import softLightBlendFunction from './glsl/soft-light.frag';
import subtractBlendFunction from './glsl/subtract.frag';


/** A blend mode. */
export class BlendMode {
  /** The opacity of the color that will be blended with the base color. */
  readonly opacity: Uniform;

  /**
   * Constructs a new blend mode.
   *
   * @param blendFunction - The blend function to use.
   * @param opacity - The opacity of the color that will be blended with the base color.
   */
  constructor(
    readonly blendFunction: BlendFunction,
    opacity = 1.0
  ) {
    this.opacity = new Uniform(opacity);
  }

  /** Returns the blend function shader code, or null for `SKIP` blend function. */
  getShaderCode(): FragmentShader | null {
    switch (this.blendFunction) {
      case BlendFunction.SKIP: return null;
      case BlendFunction.ADD: return addBlendFunction;
      case BlendFunction.ALPHA: return alphaBlendFunction;
      case BlendFunction.AVERAGE: return averageBlendFunction;
      case BlendFunction.COLOR_BURN: return colorBurnBlendFunction;
      case BlendFunction.COLOR_DODGE: return colorDodgeBlendFunction;
      case BlendFunction.DARKEN: return darkenBlendFunction;
      case BlendFunction.DIFFERENCE: return differenceBlendFunction;
      case BlendFunction.EXCLUSION: return exclusionBlendFunction;
      case BlendFunction.LIGHTEN: return lightenBlendFunction;
      case BlendFunction.MULTIPLY: return multiplyBlendFunction;
      case BlendFunction.DIVIDE: return divideBlendFunction;
      case BlendFunction.NEGATION: return negationBlendFunction;
      case BlendFunction.NORMAL: return normalBlendFunction;
      case BlendFunction.OVERLAY: return overlayBlendFunction;
      case BlendFunction.REFLECT: return reflectBlendFunction;
      case BlendFunction.SCREEN: return screenBlendFunction;
      case BlendFunction.SOFT_LIGHT: return softLightBlendFunction;
      case BlendFunction.SUBTRACT: return subtractBlendFunction;
    }
  }
}
