import {
  LinearFilter,
  RGBFormat,
  Uniform,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';

import { KernelSize, LuminanceMaterial } from '../../materials';
import { BlurPass, ShaderPass } from '../../passes';
import { BlendFunction } from '../../blending';
import { Effect, EffectName } from '../../core';

import fragmentShader from '../texture/texture.frag';

export interface BloomEffectOptions {
  /** The blend function of this effect. */
  blendFunction: BlendFunction;
  /** The luminance threshold. Raise this value to mask out darker elements in the scene. Range is [0, 1]. */
  luminanceThreshold: number;
  /** Controls the smoothness of the luminance threshold. Range is [0, 1]. */
  luminanceSmoothing: number;
  /** Deprecated. Use height or width instead. */
  resolutionScale: number;
  /** The render width. */
  width: number;
  /** The render height. */
  height: number;
  /** The blur kernel size. */
  kernelSize: KernelSize;
}

const AUTO_SIZE = -1;

/**
 * A bloom effect.
 *
 * This effect uses the fast Kawase convolution technique and a luminance filter
 * to blur bright highlights.
 */
export class BloomEffect extends Effect {
  /** A render target. */
  private readonly renderTarget: WebGLRenderTarget;

  /**
   * A blur pass.
   *
   * Do not adjust the width or height of this pass directly. Use
   * {@link width} or {@link height} instead.
   */
  private readonly blurPass: BlurPass;



  /**
   * Constructs a new bloom effect.
   */
  constructor({
    blendFunction = BlendFunction.SCREEN,
    luminanceThreshold = 0.9,
    luminanceSmoothing = 0.025,
    resolutionScale = 0.5,
    width = AUTO_SIZE,
    height = AUTO_SIZE,
    kernelSize = KernelSize.LARGE,
  }: Partial<BloomEffectOptions> = { }) {
    super(EffectName.Bloom, fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ['texture', new Uniform(null)],
      ]),
    });

    this.renderTarget = new WebGLRenderTarget(1, 1, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    });
    this.renderTarget.texture.name = 'Bloom.Target';
    this.renderTarget.texture.generateMipmaps = false;
    this.uniforms.get('texture')!.value = this.renderTarget.texture;
    this.blurPass = new BlurPass({ resolutionScale, width, height, kernelSize });
    /**
     * A luminance shader pass.
     *
     * You may disable this pass to deactivate luminance filtering.
     *
     * @type {ShaderPass}
     */
    this.luminancePass = new ShaderPass(new LuminanceMaterial(true));
    this.luminanceMaterial.threshold = luminanceThreshold;
    this.luminanceMaterial.smoothing = luminanceSmoothing;
  }

  /**
   * A texture that contains the intermediate result of this effect.
   *
   * This texture will be applied to the scene colors unless the blend function
   * is set to `SKIP`.
   */
  get texture() {
    return this.renderTarget.texture;
  }

  /** The luminance material. */
  get luminanceMaterial() {
    return this.luminancePass.getFullscreenMaterial();
  }

  /** The current width of the internal render targets. */
  get width() {
    return this.blurPass.width;
  }

  /**
   * Sets the render width.
   *
   * Use {@link BlurPass.AUTO_SIZE} to activate automatic sizing based on the
   * render height and aspect ratio.
   */
  set width(value) {
    this.blurPass.width = value;
    this.renderTarget.setSize(this.width, this.height);
  }

  /** The current height of the internal render targets. */
  get height() {
    return this.blurPass.height;
  }

  /**
   * Sets the render height.
   *
   * Use {@link BlurPass.AUTO_SIZE} to activate automatic sizing based on the
   * render width and aspect ratio.
   */
  set height(value) {
    this.blurPass.height = value;
    this.renderTarget.setSize(this.width, this.height);
  }

  // /**
  //  * Indicates whether dithering is enabled.
  //  *
  //  * @type {Boolean}
  //  * @deprecated Use blurPass.dithering instead.
  //  */
  // get dithering() {
  //   return this.blurPass.dithering;
  // }
  // /**
  //  * Enables or disables dithering.
  //  *
  //  * @type {Boolean}
  //  * @deprecated Use blurPass.dithering instead.
  //  */
  // set dithering(value) {
  //   this.blurPass.dithering = value;
  // }
  // /**
  //  * The blur kernel size.
  //  *
  //  * @type {KernelSize}
  //  * @deprecated Use blurPass.kernelSize instead.
  //  */
  // get kernelSize() {
  //   return this.blurPass.kernelSize;
  // }
  // /**
  //  * @type {KernelSize}
  //  * @deprecated Use blurPass.kernelSize instead.
  //  */
  // set kernelSize(value) {
  //   this.blurPass.kernelSize = value;
  // }

  // /**
  //  * @type {Number}
  //  * @deprecated Use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.
  //  */
  // get distinction() {
  //   console.warn(this.name, 'The distinction field has been removed, use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.');
  //   return 1.0;
  // }
  // /**
  //  * @type {Number}
  //  * @deprecated Use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.
  //  */
  // set distinction(value) {
  //   console.warn(this.name, 'The distinction field has been removed, use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.');
  // }

  // /**
  //  * Returns the current resolution scale.
  //  *
  //  * @return {Number} The resolution scale.
  //  * @deprecated Adjust the width or height instead.
  //  */
  // getResolutionScale() {
  //   return this.blurPass.getResolutionScale();
  // }

  /**
   * Sets the resolution scale.
   * @param scale - The new resolution scale.
   * @deprecated Adjust the width or height instead.
   */
  setResolutionScale(scale: number) {
    const blurPass = this.blurPass;
    blurPass.setResolutionScale(scale);
    this.renderTarget.setSize(blurPass.width, blurPass.height);
  }

  /**
   * Updates this effect.
   * @param renderer - The renderer.
   * @param inputBuffer - A frame buffer that contains the result of the previous pass.
   */
  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget
  ) {
    const renderTarget = this.renderTarget;
    if (this.luminancePass.enabled) {
      this.luminancePass.render(renderer, inputBuffer, renderTarget);
      this.blurPass.render(renderer, renderTarget, renderTarget);
    }
    else {
      this.blurPass.render(renderer, inputBuffer, renderTarget);
    }
  }

  /**
   * Updates the size of internal render targets.
   *
   * @param width - The width.
   * @param height - The height.
   */
  setSize(width: number, height: number) {
    const blurPass = this.blurPass;
    blurPass.setSize(width, height);
    this.renderTarget.setSize(blurPass.width, blurPass.height);
  }

  /**
   * Performs initialization tasks.
   * @param renderer - The renderer.
   * @param alpha - Whether the renderer uses the alpha channel or not.
   */
  initialize(renderer: WebGLRenderer, alpha: boolean) {
    this.blurPass.initialize(renderer, alpha);
    if (!alpha) {
      this.renderTarget.texture.format = RGBFormat;
    }
  }

}
