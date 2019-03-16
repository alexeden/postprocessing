import { ShaderMaterial, Uniform } from 'three';

import fragment from './copy.frag';
import vertex from '../common/common.vert';

/**
 * A simple copy shader material.
 */
export class CopyMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        inputBuffer: new Uniform(null),
        opacity: new Uniform(1.0),
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      depthWrite: false,
      depthTest: false,
    });
  }
}
