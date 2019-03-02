import { LinearFilter, WebGLRenderTarget, WebGLRenderer } from 'three';
import { CopyMaterial } from '../materials';
import { Pass } from './Pass';
import { PassName } from './lib';

/**
 * A pass that renders the result from a previous pass to another render target.
 */
export class SavePass extends Pass {
  readonly needsSwap = false;
  readonly renderTarget: WebGLRenderTarget;

  /**
   * Constructs a new save pass.
   *
   * @param renderTarget - A render target.
   * @param resize - Indicates whether the render target should be resized automatically.
   */
  constructor(
    renderTarget?: WebGLRenderTarget,
    readonly resize = true
  ) {
    super(PassName.Save);

    this.setFullscreenMaterial(new CopyMaterial());

    if (!renderTarget) {
      this.renderTarget = new WebGLRenderTarget(1, 1, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        stencilBuffer: false,
        depthBuffer: false,
      });

      this.renderTarget.texture.name = 'SavePass.Target';
      this.renderTarget.texture.generateMipmaps = false;
    }
    else {
      this.renderTarget = renderTarget;
    }
  }

  /**
   * Saves the input buffer.
   */
  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget
  ) {
    this.getFullscreenMaterials().forEach(material => {
      material.uniforms.inputBuffer.value = inputBuffer.texture;
    });

    renderer.render(this.scene, this.camera, this.renderToScreen ? undefined : this.renderTarget);
  }

  /**
   * Updates the size of this pass.
   */
  setSize(
    width: number,
    height: number
  ) {
    if (this.resize) {
      this.renderTarget.setSize(
        Math.max(1, width),
        Math.max(1, height)
      );
    }
  }

}
