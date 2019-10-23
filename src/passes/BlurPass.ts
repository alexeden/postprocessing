import { LinearFilter, RGBFormat, Vector2, WebGLRenderTarget, WebGLRenderer } from 'three';
import { ConvolutionMaterial, KernelSize } from '../materials';
import { Pass, PassName } from '../core';

export interface BlurPassOptions {
  /** The render texture resolution scale, relative to the main frame buffer size. */
  resolutionScale: number;
  /** The blur kernel size. */
  kernelSize: KernelSize;
}

/**
 * An efficient, incremental blur pass.
 *
 * Note: This pass allows the input and output buffer to be the same.
 */
export class BlurPass extends Pass {
  /** A render target. */
  private readonly renderTargetX: WebGLRenderTarget;

  /** A second render target. */
  private readonly renderTargetY: WebGLRenderTarget;

  /** The original resolution. */
  private readonly resolution: Vector2;

  /** The current resolution scale. */
  private resolutionScale: number;

  /** A convolution shader material. */
  private readonly convolutionMaterial: ConvolutionMaterial;

  /** A convolution shader material that uses dithering. */
  private readonly ditheredConvolutionMaterial: ConvolutionMaterial;

  /** Whether the blurred result should also be dithered using noise. */
  dithering: boolean;

  /**
   * Constructs a new blur pass.
   */
  constructor({
    resolutionScale = 0.5,
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
    this.resolution = new Vector2();
    this.resolutionScale = resolutionScale;
    this.convolutionMaterial = new ConvolutionMaterial();
    this.ditheredConvolutionMaterial = new ConvolutionMaterial();
    this.ditheredConvolutionMaterial.dithering = true;
    this.dithering = false;
    this.kernelSize = kernelSize;
  }

  /** The absolute width of the internal render targets. */
  get width() {
    return this.renderTargetX.width;
  }

  /** The absolute height of the internal render targets. */
  get height() {
    return this.renderTargetX.height;
  }

  /** The kernel size. */
  get kernelSize() {
    return this.convolutionMaterial.kernelSize;
  }

  /** Sets the kernel size. */
  set kernelSize(value: KernelSize) {
    this.convolutionMaterial.kernelSize = value;
    this.ditheredConvolutionMaterial.kernelSize = value;
  }

  /** Returns the current resolution scale. */
  getResolutionScale() {
    return this.resolutionScale;
  }

  /** Sets the resolution scale. */
  setResolutionScale(scale: number) {
    this.resolutionScale = scale;
    this.setSize(this.resolution.x, this.resolution.y);
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
    let destRT: WebGLRenderTarget;
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
    renderer.setRenderTarget(this.renderToScreen ? undefined : outputBuffer);
    renderer.render(scene, camera);
  }

  /**
   * Updates the size of this pass.
   */
  setSize(width: number, height: number) {
    this.resolution.set(width, height);

    // tslint:disable-next-line: no-parameter-reassignment
    width = Math.max(1, Math.floor(width * this.resolutionScale));
    // tslint:disable-next-line: no-parameter-reassignment
    height = Math.max(1, Math.floor(height * this.resolutionScale));

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
