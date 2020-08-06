// tslint:disable: no-parameter-reassignment
import { LinearFilter, RGBFormat, Vector2, WebGLRenderTarget, WebGLRenderer } from 'three';
import { ConvolutionMaterial, KernelSize } from '../materials';
import { Pass, PassName } from '../core';

export interface BlurPassOptions {
  /** The blur render height. */
  height: number;
  /** The blur kernel size. */
  kernelSize: KernelSize;
  /** The render texture resolution scale, relative to the main frame buffer size. */
  resolutionScale: number;
  /** The blur render width. */
  width: number;
}

/**
 * An auto sizing constant.
 */
const AUTO_SIZE = -1;

/**
 * An efficient, incremental blur pass.
 */
export class BlurPass extends Pass {
  /**
   * An auto sizing flag that can be used for the render {@link BlurPass.width}
   * and {@link BlurPass.height}.
   *
   * It's recommended to set the height or the width to an absolute value for
   * consistent blur results across different devices and resolutions.
   */
  static readonly AUTO_SIZE = AUTO_SIZE;

  /** A render target. */
  private readonly renderTargetX: WebGLRenderTarget;

  /** A second render target. */
  private readonly renderTargetY: WebGLRenderTarget;

  /** The current main render size. */
  private readonly originalSize: Vector2;

  /** The absolute render resolution. */
  private readonly resolution: Vector2;

  /** The current resolution scale. */
  private resolutionScale: number;

  /** A convolution shader material. */
  private readonly convolutionMaterial: ConvolutionMaterial;

  /** A convolution shader material that uses dithering. */
  private readonly ditheredConvolutionMaterial: ConvolutionMaterial;

  /** Whether the blurred result should also be dithered using noise. */
  dithering: boolean;

  /** Constructs a new blur pass. */
  constructor({
    resolutionScale = 0.5,
    width = AUTO_SIZE,
    height = AUTO_SIZE,
    kernelSize = KernelSize.LARGE,
  }: Partial<BlurPassOptions> = { }) {
    super(PassName.Blur);

    this.renderTargetX = new WebGLRenderTarget(1, 1, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    });
    this.renderTargetX.texture.name = 'Blur.TargetX';
    this.renderTargetY = this.renderTargetX.clone();
    this.renderTargetY.texture.name = 'Blur.TargetY';
    this.originalSize = new Vector2();
    this.resolution = new Vector2(width, height);
    this.resolutionScale = resolutionScale;
    this.convolutionMaterial = new ConvolutionMaterial();
    this.ditheredConvolutionMaterial = new ConvolutionMaterial();
    this.ditheredConvolutionMaterial.dithering = true;
    this.dithering = false;
    this.kernelSize = kernelSize;
  }

  /** The current width of the internal render targets. */
  get width() {
    return this.renderTargetX.width;
  }

  /**
   * Sets the render width.
   *
   * Use {@link BlurPass.AUTO_SIZE} to activate automatic sizing based on the
   * render height and aspect ratio.
   */
  set width(value) {
    this.resolution.x = value;
    this.setSize(this.originalSize.x, this.originalSize.y);
  }

  /** The current height of the internal render targets. */
  get height() {
    return this.renderTargetX.height;
  }

  /**
   * Sets the render height.
   *
   * Use {@link BlurPass.AUTO_SIZE} to activate automatic sizing based on the
   * render width and aspect ratio.
   */
  set height(value) {
    this.resolution.y = value;
    this.setSize(this.originalSize.x, this.originalSize.y);
  }

  /** The current blur scale. */
  get scale() {
    return this.convolutionMaterial.uniforms.scale.value;
  }

  /**
   * Sets the blur scale.
   *
   * This value influences the overall blur strength and should not be greater
   * than 1. For larger blurs please increase the {@link kernelSize}!
   *
   * Note that the blur strength is closely tied to the resolution. For a smooth
   * transition from no blur to full blur, set the width or the height to a high
   * enough value.
   */
  set scale(value) {
    this.convolutionMaterial.uniforms.scale.value = value;
    this.ditheredConvolutionMaterial.uniforms.scale.value = value;
  }

  /** The kernel size. */
  get kernelSize() {
    return this.convolutionMaterial.kernelSize;
  }

  /**
   * Sets the kernel size.
   *
   * Larger kernels require more processing power but scale well with larger
   * render resolutions.
   */
  set kernelSize(value) {
    this.convolutionMaterial.kernelSize = value;
    this.ditheredConvolutionMaterial.kernelSize = value;
  }

  /**
   * Blurs the input buffer and writes the result to the output buffer. The
   * input buffer remains intact, unless its also the output buffer.
   *
   * @param renderer - The renderer.
   * @param inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   */
  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    outputBuffer: WebGLRenderTarget
  ) {
    const scene = this.scene;
    const camera = this.camera;
    const renderTargetX = this.renderTargetX;
    const renderTargetY = this.renderTargetY;
    let material = this.convolutionMaterial;
    let uniforms = material.uniforms;
    const kernel = material.getKernel();
    let lastRT = inputBuffer;
    let destRT;
    let i: number;
    let l: number;
    this.setFullscreenMaterial(material);
    // Apply the multi-pass blur.
    // tslint:disable-next-line: ban-comma-operator
    for (i = 0, l = kernel.length - 1; i < l; ++i) {
      // Alternate between targets.
      destRT = ((i % 2) === 0) ? renderTargetX : renderTargetY;
      uniforms.kernel.value = kernel[i];
      uniforms.inputBuffer.value = lastRT.texture;
      renderer.setRenderTarget(destRT);
      renderer.render(scene, camera);
      lastRT = destRT;
    }
    if (this.dithering) {
      material = this.ditheredConvolutionMaterial;
      uniforms = material.uniforms;
      this.setFullscreenMaterial(material);
    }
    uniforms.kernel.value = kernel[i];
    uniforms.inputBuffer.value = lastRT.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(scene, camera);
  }
  /**
   * Updates the size of this pass.
   */
  setSize(width: number, height: number) {
    const resolution = this.resolution;
    const aspect = width / height;
    this.originalSize.set(width, height);
    if (resolution.x !== AUTO_SIZE && resolution.y !== AUTO_SIZE) {
      width = Math.max(1, resolution.x);
      height = Math.max(1, resolution.y);
    }
    else if (resolution.x !== AUTO_SIZE) {
      width = Math.max(1, resolution.x);
      height = Math.round(Math.max(1, resolution.y) / aspect);
    }
    else if (resolution.y !== AUTO_SIZE) {
      width = Math.round(Math.max(1, resolution.y) * aspect);
      height = Math.max(1, resolution.y);
    }
    else {
      width = Math.max(1, Math.round(width * this.resolutionScale));
      height = Math.max(1, Math.round(height * this.resolutionScale));
    }
    this.renderTargetX.setSize(width, height);
    this.renderTargetY.setSize(width, height);
    this.convolutionMaterial.setTexelSize(1.0 / width, 1.0 / height);
    this.ditheredConvolutionMaterial.setTexelSize(1.0 / width, 1.0 / height);
  }

  /**
   * Performs initialization tasks.
   *
   * @param renderer - The renderer.
   * @param alpha - Whether the renderer uses the alpha channel or not.
   */
  initialize(renderer: WebGLRenderer, alpha: boolean) {
    if (!alpha) {
      this.renderTargetX.texture.format = RGBFormat;
      this.renderTargetY.texture.format = RGBFormat;
    }
  }
}
