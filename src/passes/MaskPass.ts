import { Scene, Camera, WebGLRenderer, WebGLRenderTarget } from 'three';
import { ClearPass } from './ClearPass';
import { PassName } from './lib';
import { Pass } from './Pass';

/**
 * A mask pass.
 *
 * This pass requires that the input and output buffers have a stencil buffer.
 * You can enable the stencil buffer via the {@link EffectComposer} constructor.
 */
export class MaskPass extends Pass {
  /** Inverse flag */
  inverse = false;

  private clearPass: ClearPass;

  /**
   * Constructs a new mask pass.
   *
   * @param scene - The scene to render.
   * @param camera - The camera to use.
   */
  constructor(
    scene: Scene,
    camera: Camera
  ) {
    super(PassName.Mask, scene, camera);
    this.needsSwap = false;
    this.clearPass = new ClearPass(false, false, true);
  }

  /**
   * Indicates whether this pass should clear the stencil buffer.
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
   * Renders the effect.
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
    const context = renderer.context;
    const state = renderer.state;

    const scene = this.scene;
    const camera = this.camera;
    const clearPass = this.clearPass;

    const writeValue = this.inverse ? 0 : 1;
    const clearValue = 1 - writeValue;

    // Don't update color or depth.
    state.buffers.color.setMask(0);
    state.buffers.depth.setMask(0);

    // Lock the buffers.
    state.buffers.color.setLocked(true);
    state.buffers.depth.setLocked(true);

    // Configure the stencil.
    state.buffers.stencil.setTest(true);
    state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
    state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
    state.buffers.stencil.setClear(clearValue);

    // Clear the stencil.
    if (this.clear) {
      if (this.renderToScreen) {
        clearPass.render(renderer, null);
      }
      else {
        clearPass.render(renderer, inputBuffer);
        clearPass.render(renderer, outputBuffer);
      }
    }

    // Draw the mask.
    if (this.renderToScreen) {
      renderer.setRenderTarget(null as any);
      renderer.render(scene, camera);
    }
    else {
      renderer.setRenderTarget(inputBuffer);
      renderer.render(scene, camera);
      renderer.setRenderTarget(outputBuffer);
      renderer.render(scene, camera);
    }

    // Unlock the buffers.
    state.buffers.color.setLocked(false);
    state.buffers.depth.setLocked(false);

    // Only render where the stencil is set to 1.
    state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
    state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
  }
}
