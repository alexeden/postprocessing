import {
  LinearFilter,
  RGBFormat,
  Uniform,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';
import { KernelSize, LuminanceMaterial } from '../../materials';
import { BlurPass, ShaderPass } from '../../passes';
import { BlendFunction } from '../../blending';
import { Effect, EffectName } from '../../core';
import fragment from '../texture/texture.frag';

export interface BloomEffectOptions {
  /** The blend function of this effect. */
  blendFunction: BlendFunction;
  /** The luminance distinction factor. Raise this value to bring out the brighter elements in the scene. */
  distinction: number;
  /** The render texture resolution scale, relative to the main frame buffer size. */
  resolutionScale: number;
  /** The blur kernel size. */
  kernelSize: KernelSize;
}

/**
 * A bloom effect.
 *
 * This effect uses the fast Kawase convolution technique and a luminance filter
 * to blur bright highlights.
 */
export class BloomEffect extends Effect {
  /** A render target. */
  private readonly renderTarget: WebGLRenderTarget;

  /** A blur pass. */
  private readonly blurPass: BlurPass;

  /** THe original resolution. */
  private readonly resolution: Vector2;

  /** A luminance shader pass. */
  private readonly luminancePass: ShaderPass;

  /**
   * Constructs a new bloom effect.
   */
  constructor({
    blendFunction = BlendFunction.SCREEN,
    distinction = 1.0,
    resolutionScale = 0.5,
    kernelSize = KernelSize.LARGE,
  }: Partial<BloomEffectOptions> = { }) {
    super(EffectName.Bloom, fragment, {
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
    this.blurPass = new BlurPass({ resolutionScale, kernelSize });
    this.resolution = new Vector2();
    this.luminancePass = new ShaderPass(new LuminanceMaterial(true));
    this.distinction = distinction;
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

  /** Indicates whether dithering is enabled. */
  get dithering() {
    return this.blurPass.dithering;
  }

  /** Enables or disables dithering. */
  set dithering(value: boolean) {
    this.blurPass.dithering = value;
  }

  /** The blur kernel size. */
  get kernelSize() {
    return this.blurPass.kernelSize;
  }

  set kernelSize(value: KernelSize) {
    this.blurPass.kernelSize = value;
  }

  /** The luminance distinction factor. */
  get distinction() {
    const luminanceMaterial = this.luminancePass.getFullscreenMaterial() as LuminanceMaterial;

    return luminanceMaterial.uniforms.distinction.value;
  }

  set distinction(value) {
    const luminanceMaterial = this.luminancePass.getFullscreenMaterial() as LuminanceMaterial;
    luminanceMaterial.uniforms.distinction.value = value ?? 1.0;
  }

  /** Returns the current resolution scale. */
  getResolutionScale() {
    return this.blurPass.getResolutionScale();
  }

  /** Sets the resolution scale. */
  setResolutionScale(scale: number) {
    this.blurPass.setResolutionScale(scale);
    this.setSize(this.resolution.x, this.resolution.y);
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
    this.luminancePass.render(renderer, inputBuffer, renderTarget);
    this.blurPass.render(renderer, renderTarget, renderTarget);
  }

  /**
   * Updates the size of internal render targets.
   */
  setSize(width: number, height: number) {
    this.resolution.set(width, height);
    this.blurPass.setSize(width, height);
    // tslint:disable-next-line: no-parameter-reassignment
    width = this.blurPass.width;
    // tslint:disable-next-line: no-parameter-reassignment
    height = this.blurPass.height;
    this.renderTarget.setSize(width, height);
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
