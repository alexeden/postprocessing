import { Uniform } from 'three';
import { BlendFunction } from './BlendFunction';

import addBlendFunction from './glsl/add/shader.frag';
import alphaBlendFunction from './glsl/alpha/shader.frag';
import averageBlendFunction from './glsl/average/shader.frag';
import colorBurnBlendFunction from './glsl/color-burn/shader.frag';
import colorDodgeBlendFunction from './glsl/color-dodge/shader.frag';
import darkenBlendFunction from './glsl/darken/shader.frag';
import differenceBlendFunction from './glsl/difference/shader.frag';
import exclusionBlendFunction from './glsl/exclusion/shader.frag';
import lightenBlendFunction from './glsl/lighten/shader.frag';
import multiplyBlendFunction from './glsl/multiply/shader.frag';
import divideBlendFunction from './glsl/divide/shader.frag';
import negationBlendFunction from './glsl/negation/shader.frag';
import normalBlendFunction from './glsl/normal/shader.frag';
import overlayBlendFunction from './glsl/overlay/shader.frag';
import reflectBlendFunction from './glsl/reflect/shader.frag';
import screenBlendFunction from './glsl/screen/shader.frag';
import softLightBlendFunction from './glsl/soft-light/shader.frag';
import subtractBlendFunction from './glsl/subtract/shader.frag';


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
