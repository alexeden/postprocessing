import {
  Color,
  MeshNormalMaterial,
  LinearFilter,
  RGBFormat,
  Vector2,
  WebGLRenderTarget,
  Scene,
  Camera,
  WebGLRenderer,
} from 'three';

import { Pass, PassName } from '../core';
import { RenderPass } from './RenderPass';

export interface NormalPassOptions {
  /**
   * The render texture resolution scale, relative to the screen render size.
   * default 0.5
   */
  resolutionScale?: number;
  /** A custom render target. */
  renderTarget?: WebGLRenderTarget;
}

/**
 * A pass that renders the normals of a given scene.
 */
export class NormalPass extends Pass {
  needsSwap = false;

  private renderPass: RenderPass;

  /** A render target that contains the scene normals. */
  private renderTarget: WebGLRenderTarget;

  /** The original resolution */
  private resolution = new Vector2();

  /** The current resolution scale. */
  private resolutionScale = 0.5;

  /**
   * Constructs a new normal pass.
   *
   * @param scene - The scene to render.
   * @param camera - The camera to use to render the scene.
   * @param [options] - The options.
   */
  constructor(
    readonly scene: Scene,
    readonly camera: Camera,
    options: NormalPassOptions = { }
  ) {
    super(PassName.Normal, scene, camera);

    this.renderPass = new RenderPass(scene, camera, {
      overrideMaterial: new MeshNormalMaterial({
        morphTargets: true,
        skinning: true,
      } as any),
      clearColor: new Color(0x7777ff),
      clearAlpha: 1.0,
    } as any);


    const defaultRenderTarget = (() => {
      const target = new WebGLRenderTarget(1, 1, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBFormat,
      });
      target.texture.name = 'NormalPass.Target';
      target.texture.generateMipmaps = false;

      return target;
    })();

    this.renderTarget = !!options.renderTarget
      ? options.renderTarget
      : defaultRenderTarget;

    this.resolutionScale = (options.resolutionScale !== undefined)
      ? options.resolutionScale
      : 0.5;
  }

  /**
   * Returns the current resolution scale.
   */
  getResolutionScale() {
    return this.resolutionScale;
  }

  /**
   * Sets the resolution scale.
   */
  setResolutionScale(scale: number) {
    this.resolutionScale = scale;
    this.setSize(this.resolution.x, this.resolution.y);
  }

  /**
   * Renders the scene normals.
   *
   * @param renderer - The renderer.
   * @param inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param [delta] - The time between the last frame and the current one in seconds.
   * @param [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    outputBuffer: WebGLRenderTarget,
    delta?: number,
    stencilTest?: boolean
  ) {
    const renderTarget = this.renderToScreen ? null : this.renderTarget;
    this.renderPass.render(renderer, renderTarget, renderTarget);
  }

  /**
   * Updates the size of this pass.
   */
  setSize(width: number, height: number) {
    this.resolution.set(width, height);
    this.renderTarget.setSize(
      Math.max(1, Math.floor(width * this.resolutionScale)),
      Math.max(1, Math.floor(height * this.resolutionScale))
    );
  }
}
