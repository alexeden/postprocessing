import { Scene, Camera, Material, WebGLRenderer, WebGLRenderTarget, DepthTexture } from 'three';
import { ClearPass } from './ClearPass';
import { Pass } from './Pass';
import { PassName } from './lib';

export interface RenderPassOptions {
  /** An override material for the scene. */
  overrideMaterial: Material | null;
  /** An override clear alpha. */
  clearAlpha: number;
  /** Whether depth should be cleared explicitly. */
  clearDepth: boolean;
  /** Whether all buffers should be cleared. */
  clear: boolean;
}

/**
 * A pass that renders a given scene into the input buffer or to screen.
 * This pass uses a {@link ClearPass} to clear the target buffer.
 */
export class RenderPass extends Pass {
  private readonly clearPass: ClearPass;
  private depthTexture: DepthTexture | null;

  /**
   * Constructs a new render pass.
   *
   * @param scene The scene to render.
   * @param camera The camera to use to render the scene.
   * @param options Additional options.
   */
  constructor(
    readonly scene: Scene,
    readonly camera: Camera,
    readonly overrideMaterial: Material | null = null
  ) {
    super(PassName.Render, scene, camera);

    this.needsSwap = false;
    this.clearPass = new ClearPass();
    this.depthTexture = null;
  }

  /**
   * Indicates whether the target buffer should be cleared before rendering.
   */
  get clear() {
    return this.clearPass.enabled;
  }

  /**
   * Enables or disables auto clear.
   */
  set clear(value) {
    this.clearPass.enabled = value;
  }

  /**
   * Returns the clear pass.
   */
  getClearPass() {
    return this.clearPass;
  }

  /**
   * Returns the current depth texture.
   */
  getDepthTexture() {
    return this.depthTexture;
  }

  /**
   * Sets the depth texture.
   *
   * The provided texture will be attached to the input buffer unless this pass
   * renders to screen.
   */
  setDepthTexture(
    depthTexture: DepthTexture,
    depthPacking = 0
  ) {
    this.depthTexture = depthTexture;
  }

  /**
   * Renders the scene.
   *
   * @param renderer The renderer.
   * @param inputBuffer A frame buffer that contains the result of the previous pass.
   * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   */
  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    outputBuffer: WebGLRenderTarget
  ) {
    const scene = this.scene;
    const overrideMaterial = scene.overrideMaterial;

    if (this.depthTexture !== null && !this.renderToScreen) {
      inputBuffer.depthTexture = this.depthTexture;
      (outputBuffer as any).depthTexture = null;
    }

    if (this.clear) {
      this.clearPass.renderToScreen = this.renderToScreen;
      this.clearPass.render(renderer, inputBuffer);
    }

    scene.overrideMaterial = this.overrideMaterial;
    renderer.setRenderTarget(this.renderToScreen ? undefined : inputBuffer);
    renderer.render(scene, this.camera);
    scene.overrideMaterial = overrideMaterial;


    // const scene = this.scene;
    // const renderTarget = this.renderToScreen ? undefined : inputBuffer;
    // const overrideMaterial = scene.overrideMaterial;

    // if (this.clear) {
    //   this.clearPass.renderToScreen = this.renderToScreen;
    //   this.clearPass.render(renderer, inputBuffer);
    // }
    // else if (this.clearDepth) {
    //   renderer.setRenderTarget(renderTarget);
    //   renderer.clearDepth();
    // }

    // scene.overrideMaterial = this.overrideMaterial;
    // renderer.setRenderTarget(renderTarget);
    // renderer.render(scene, this.camera);
    // scene.overrideMaterial = overrideMaterial;
  }
}
