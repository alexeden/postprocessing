import { WebGLRenderer, WebGLRenderTarget } from 'three';
import { PassName } from '../core';
import { Pass } from './Pass';
import { PostprocessingMaterial } from '../materials';

/**
 * A shader pass. Renders any shader material as a fullscreen effect.
 *
 * This pass should not be used to create multiple chained effects. For a more
 * efficient solution, please refer to the {@link EffectPass}.
 */
export class ShaderPass extends Pass {
  /**
   * Constructs a new shader pass.
   *
   * @param material - A shader material.
   * @param input - The name of the input buffer uniform.
   */
  constructor(
    material: PostprocessingMaterial,
    input = 'inputBuffer'
  ) {
    super(PassName.Shader);
    this.setFullscreenMaterial(material);

    /**
     * The input buffer uniform.
     */
    this.uniform = null;
    this.setInput(input);
  }

  /**
   * Sets the name of the input buffer uniform.
   *
   * Most fullscreen materials modify texels from an input texture. This pass
   * automatically assigns the main input buffer to the uniform identified by
   * the given name.
   *
   * @param input - The name of the input buffer uniform.
   */
  setInput(input: string) {
    const materials = this.getFullscreenMaterials();
    this.uniform = null;
    materials.forEach(material => {
      const uniforms = material.uniforms;
      if (uniforms !== undefined && uniforms[input] !== undefined) {
        this.uniform = uniforms[input];
      }
    });
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
    if (this.uniform !== null) {
      this.uniform.value = inputBuffer.texture;
    }

    renderer.setRenderTarget(this.renderToScreen ? null as any : outputBuffer);
    renderer.render(this.scene, this.camera);
  }
}
