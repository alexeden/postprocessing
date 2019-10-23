import { ShaderMaterial, Uniform, Vector2 } from 'three';

import fragment from './convolution.frag';
import vertex from './convolution.vert';

/**
 * A kernel size enumeration.
 */
export enum KernelSize {
  /** A very small kernel that matches a 7x7 Gauss blur kernel. */
  VERY_SMALL = 0,
  /** A small kernel that matches a 15x15 Gauss blur kernel. */
  SMALL = 1,
  /** A medium sized kernel that matches a 23x23 Gauss blur kernel. */
  MEDIUM = 2,
  /** A large kernel that matches a 35x35 Gauss blur kernel. */
  LARGE = 3,
  /** A very large kernel that matches a 63x63 Gauss blur kernel. */
  VERY_LARGE = 4,
  /** A huge kernel that matches a 127x127 Gauss blur kernel. */
  HUGE = 5,
}

/**
 * The Kawase blur kernel presets.
 */
const kernelPresets = [
  new Float32Array([0.0, 0.0]),
  new Float32Array([0.0, 1.0, 1.0]),
  new Float32Array([0.0, 1.0, 1.0, 2.0]),
  new Float32Array([0.0, 1.0, 2.0, 2.0, 3.0]),
  new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 4.0, 5.0]),
  new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0]),
];

/**
 * An optimised convolution shader material.
 *
 * This material supports dithering.
 *
 * Based on the GDC2003 Presentation by Masaki Kawase, Bunkasha Games:
 *  Frame Buffer Postprocessing Effects in DOUBLE-S.T.E.A.L (Wreckless)
 * and an article by Filip Strugar, Intel:
 *  An investigation of fast real-time GPU-based image blur algorithms
 *
 * Further modified according to Apple's
 * [Best Practices for Shaders](https://goo.gl/lmRoM5).
 */
export class ConvolutionMaterial extends ShaderMaterial {
  /**
   * The current kernel size.
   */
  kernelSize = KernelSize.LARGE;

  /**
   * Constructs a new convolution material.
   * @param [texelSize] - The absolute screen texel size.
   */
  constructor(texelSize = new Vector2()) {
    super({
      uniforms: {
        inputBuffer: new Uniform(null),
        texelSize: new Uniform(new Vector2()),
        halfTexelSize: new Uniform(new Vector2()),
        kernel: new Uniform(0.0),
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      depthWrite: false,
      depthTest: false,
    });
    this.setTexelSize(texelSize.x, texelSize.y);
  }

  /**
   * Returns the kernel.
   */
  getKernel() {
    return kernelPresets[this.kernelSize];
  }

  /**
   * Sets the texel size.
   * @param x - The texel width.
   * @param y - The texel height.
   */
  setTexelSize(x: number, y: number) {
    this.uniforms.texelSize.value.set(x, y);
    this.uniforms.halfTexelSize.value.set(x, y).multiplyScalar(0.5);
  }
}
