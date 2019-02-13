import { Uniform, Vector2 } from 'three';
import { BlendFunction } from './blending/BlendFunction';
import { EffectAttribute, EffectName } from './lib';
import { Effect } from './Effect';

import fragment from './glsl/chromatic-aberration/shader.frag';
import vertex from './glsl/chromatic-aberration/shader.vert';


export interface ChromaticAberrationEffectOptions {
  blendFunction: BlendFunction;
  offset: Vector2;
}

/**
 * A chromatic aberration effect.
 */
export class ChromaticAberrationEffect extends Effect {

  constructor(
    partialOptions: Partial<ChromaticAberrationEffectOptions> = { }
  ) {

    const options: ChromaticAberrationEffectOptions = {
      blendFunction: BlendFunction.NORMAL,
      offset: new Vector2(0.001, 0.0005),
      ...partialOptions,
    };

    super(EffectName.ChromaticAberration, fragment, {
      attributes: EffectAttribute.CONVOLUTION,
      blendFunction: options.blendFunction,
      uniforms: new Map([
        ['offset', new Uniform(options.offset)],
      ]),
      vertexShader: vertex,
    });
  }

  /**
   * The color offset.
   */
  get offset(): Vector2 {
    return this.uniforms.get('offset')!.value;
  }

  set offset(value: Vector2) {
    this.uniforms.get('offset')!.value = value;
  }
}
