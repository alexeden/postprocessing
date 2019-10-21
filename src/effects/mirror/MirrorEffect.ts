import { Uniform } from 'three';
import { BlendFunction } from '../../blending';
import { Effect, EffectName } from '../../core';

import fragment from './mirror.frag';
import vertex from './mirror.vert';

export interface MirrorEffectOptions {
  /** The blend function of this effect. Default is BlendFunction.NORMAL. */
  blendFunction: BlendFunction;
  side: number;
}

export class MirrorEffect extends Effect {
  constructor(
    {
      blendFunction = BlendFunction.NORMAL,
      side = 1,
    }: Partial<MirrorEffectOptions> = { }
  ) {
    super(EffectName.Mirror, fragment, {
      blendFunction,
      uniforms: new Map([
        ['side', new Uniform(side)],
      ]),
      vertexShader: vertex,
    });
  }
}
