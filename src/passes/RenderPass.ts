import { Scene, Camera, Material, WebGLRenderer, WebGLRenderTarget } from 'three';
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
 * A pass that renders a given scene directly on screen or into the read buffer
 * for further processing.
 */
export class RenderPass extends Pass {
  readonly clearDepth: boolean;
  readonly clearPass: ClearPass;
  readonly overrideMaterial: Material | null = null;

  /**
   * Indicates whether the color, depth and stencil buffers should be cleared.
   *
   * Even with clear set to true you can prevent specific buffers from being
   * cleared by setting either the autoClearColor, autoClearStencil or
   * autoClearDepth properties of the renderer to false.
   */
  readonly clear: boolean;

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
    partialOptions: Partial<RenderPassOptions> = { }
  ) {
    super(PassName.Render, scene, camera);

    const options: RenderPassOptions = {
      overrideMaterial: null,
      clearAlpha: 1,
      clearDepth: false,
      clear: true,
      ...partialOptions,
    };

    this.needsSwap = false;
    this.clearPass = new ClearPass(options);
    this.overrideMaterial = options.overrideMaterial;
    this.clearDepth = options.clearDepth;
    this.clear = options.clear;
  }

  /**
   * Renders the scene.
   *
   * @param renderer The renderer.
   * @param inputBuffer A frame buffer that contains the result of the previous pass.
   * @param outputBuffer A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param delta The time between the last frame and the current one in seconds.
   * @param stencilTest Indicates whether a stencil mask is active.
   */
  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    outputBuffer: WebGLRenderTarget,
    delta: number,
    stencilTest: boolean
  ) {
    const scene = this.scene;
    const renderTarget = this.renderToScreen ? undefined : inputBuffer;
    const overrideMaterial = scene.overrideMaterial;

    if (this.clear) {
      this.clearPass.renderToScreen = this.renderToScreen;
      this.clearPass.render(renderer, inputBuffer);
    }
    else if (this.clearDepth) {
      renderer.setRenderTarget(renderTarget);
      renderer.clearDepth();
    }

    scene.overrideMaterial = this.overrideMaterial;
    renderer.render(scene, this.camera, renderTarget);
    scene.overrideMaterial = overrideMaterial;
  }
}
