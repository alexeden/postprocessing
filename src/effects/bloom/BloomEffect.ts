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
   * Do not adjust the width or height of this pass directly. Use
   * {@link width} or {@link height} instead.
   */
  private readonly blurPass: BlurPass;
  /**
   * A luminance shader pass.
   * You may disable this pass to deactivate luminance filtering.
   */
  private readonly luminancePass: ShaderPass;

  /**
   * Constructs a new bloom effect.
   */
  constructor({
    blendFunction = BlendFunction.SCREEN,
    luminanceThreshold = 0.9,
    luminanceSmoothing = 0.025,
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
    this.blurPass = new BlurPass({ width, height, kernelSize });
    const luminanceMaterial = new LuminanceMaterial(true);
    luminanceMaterial.threshold = luminanceThreshold;
    luminanceMaterial.smoothing = luminanceSmoothing;
    this.luminancePass = new ShaderPass(new LuminanceMaterial(true));
  }

  /**
   * A texture that contains the intermediate result of this effect.
   *
   * This texture will be applied to the scene colors unless the blend function is set to `SKIP`.
   */
  get texture() {
    return this.renderTarget.texture;
  }

  /** The luminance material. */
  get luminanceMaterial(): LuminanceMaterial {
    return this.luminancePass.getFullscreenMaterial() as LuminanceMaterial;
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
