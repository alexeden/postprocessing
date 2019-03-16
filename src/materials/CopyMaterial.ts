import { ShaderMaterial, Uniform } from 'three';

import fragment from './glsl/copy.frag';
import vertex from './glsl/common.vert';

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
