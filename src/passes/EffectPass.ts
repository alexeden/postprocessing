import { PerspectiveCamera, Camera, Material, Texture, WebGLRenderer, WebGLRenderTarget } from 'three';
import { BlendFunction } from '../effects/blending';
import { EffectAttribute, Effect } from '../effects';
import { EffectMaterial, Section } from '../materials';
import { Pass } from './Pass';
import { PassName } from './lib';



/**
 * An effect pass.
 *
 * Use this pass to combine {@link Effect} instances.
 */
export class EffectPass extends Pass {
  /**
   * The effects, sorted by attribute priority, DESC.
   */
  private readonly effects: Effect[];

  /**
   * Indicates whether this pass should skip rendering.
   * Effects will still be updated, even if this flag is true.
   */
  private skipRendering = false;

  /**
   * Indicates whether dithering is enabled.
   */
  private quantize = false;

  /**
   * The amount of shader uniforms that this pass uses.
   */
  private uniforms = 0;

  /**
   * The amount of shader varyings that this pass uses.
   */
  private varyings = 0;

  /**
   * A time offset.
   *
   * Elapsed time will start at this value.
   *
   * @type {Number}
   */
  minTime = 1.0;


  /**
   * The maximum time.
   * If the elapsed time exceeds this value, it will be reset.
   */
  maxTime = 1e3;

  /**
   * Constructs a new effect pass.
   *
   * The provided effects will be organized and merged for optimal performance.
   *
   * @param camera - The main camera. The camera's type and settings will be available to all effects.
   * @param effects - The effects that will be rendered by this pass.
   */
  constructor(
    private readonly mainCamera: Camera | PerspectiveCamera,
    ...effects: Effect[]
  ) {

    super(PassName.Effect);
    this.effects = effects.sort((a, b) => (b.attributes - a.attributes));
    this.setFullscreenMaterial(this.createMaterial());
  }

  /**
   * Indicates whether dithering is enabled.
   * Color quantization reduces banding artifacts but degrades performance.
   */
  get dithering() {
    return this.quantize;
  }

  /**
   * Enables or disables dithering.
   * Note that some effects like bloom have their own dithering setting.
   */
  set dithering(value: boolean) {
    if (this.quantize !== value) {
      const material = this.getFullscreenMaterial();

      if (material !== null) {
        material.dithering = value;
        material.needsUpdate = true;
      }

      this.quantize = value;
    }
  }

  /**
   * Creates a compound shader material.
   *
   * @return The new material.
   */

  private createMaterial(): Material {
    const blendRegExp = /\bblend\b/g;

    const shaderParts = new Map([
      [Section.FRAGMENT_HEAD, ''],
      [Section.FRAGMENT_MAIN_UV, ''],
      [Section.FRAGMENT_MAIN_IMAGE, ''],
      [Section.VERTEX_HEAD, ''],
      [Section.VERTEX_MAIN_SUPPORT, ''],
    ]);

    const blendModes = new Map();
    const defines = new Map();
    const uniforms = new Map();
    const extensions = new Set();

    let id = 0, varyings = 0, attributes = 0;
    let transformedUv = false;
    let readDepth = false;
    let result;

    for (const effect of this.effects) {

      if (effect.blendMode.blendFunction === BlendFunction.SKIP) {
        continue;
      }
      else if ((attributes & EffectAttribute.CONVOLUTION) !== 0 && (effect.attributes & EffectAttribute.CONVOLUTION) !== 0) {
        console.error('Convolution effects cannot be merged', effect);
      }
      else {
        attributes |= effect.attributes;

        result = integrateEffect(('e' + id++), effect, shaderParts, blendModes, defines, uniforms, attributes);

        varyings += result.varyings.length;
        transformedUv = transformedUv || result.transformedUv;
        readDepth = readDepth || result.readDepth;

        if (effect.extensions !== null) {
          // Collect the WebGL extensions that are required by this effect.
          for (const extension of effect.extensions) {
            extensions.add(extension);
          }
        }
      }
    }

    // Integrate the relevant blend functions.
    for (const blendMode of blendModes.values()) {
      shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) +
        blendMode.getShaderCode().replace(blendRegExp, 'blend' + blendMode.blendFunction) + '\n');
    }

    // Check if any effect relies on depth.
    if ((attributes & EffectAttribute.DEPTH) !== 0) {
      // Only read depth if any effect actually uses this information.
      if (readDepth) {
        shaderParts.set(Section.FRAGMENT_MAIN_IMAGE, 'float depth = readDepth(UV);\n\n\t' +
          shaderParts.get(Section.FRAGMENT_MAIN_IMAGE));
      }

      this.needsDepthTexture = true;
    }

    // Check if any effect transforms UVs in the fragment shader.
    if (transformedUv) {
      shaderParts.set(Section.FRAGMENT_MAIN_UV, 'vec2 transformedUv = vUv;\n' +
        shaderParts.get(Section.FRAGMENT_MAIN_UV));

      defines.set('UV', 'transformedUv');
    }
    else {
      defines.set('UV', 'vUv');
    }

    shaderParts.forEach((value, key, map) => map.set(key, value.trim()));

    this.uniforms = uniforms.size;
    this.varyings = varyings;

    this.skipRendering = (id === 0);
    this.needsSwap = !this.skipRendering;

    const material = new EffectMaterial(shaderParts, defines, uniforms, this.mainCamera, this.dithering);

    if (extensions.size > 0) {
      // Enable required WebGL extensions.
      for (const extension of extensions) {
        material.extensions[extension] = true;
      }
    }

    return material;
  }

  /**
   * Destroys the current fullscreen shader material and builds a new one.
   *
   * Warning: This method performs a relatively expensive shader recompilation.
   */
  recompile() {
    let material = this.getFullscreenMaterial();
    let width = 0, height = 0;
    let depthTexture = null;
    let depthPacking = 0;

    if (material !== null) {
      const resolution = material.uniforms.resolution.value;
      width = resolution.x; height = resolution.y;
      depthTexture = material.uniforms.depthBuffer.value;
      depthPacking = material.depthPacking;
      material.dispose();

      this.uniforms = 0;
      this.varyings = 0;
    }

    material = this.createMaterial();
    material.setSize(width, height);
    this.setFullscreenMaterial(material);
    this.setDepthTexture(depthTexture, depthPacking);
  }

  /**
   * Returns the current depth texture.
   *
   * @return The current depth texture, or null if there is none.
   */
  getDepthTexture(): Texture {
    const material = this.getFullscreenMaterial();

    return (material !== null) ? material.uniforms.depthBuffer.value : null;
  }

  /**
   * Sets the depth texture.
   *
   * @param depthTexture - A depth texture.
   * @param depthPacking - The depth packing.
   */
  setDepthTexture(
    depthTexture: Texture,
    depthPacking = 0
  ) {
    const material = this.getFullscreenMaterial();

    material.uniforms.depthBuffer.value = depthTexture;
    material.depthPacking = depthPacking;
    material.needsUpdate = true;

    for (const effect of this.effects) {
      effect.setDepthTexture(depthTexture, depthPacking);
    }

    this.needsDepthTexture = (depthTexture === null);
  }

  /**
   * Renders the effect.
   *
   * @param renderer - The renderer.
   * @param inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param delta - The time between the last frame and the current one in seconds.
   */
  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    outputBuffer: WebGLRenderTarget,
    delta = 1
  ) {
    const material = this.getFullscreenMaterial();
    const time = material.uniforms.time.value + delta;

    for (const effect of this.effects) {
      effect.update(renderer, inputBuffer, delta);
    }

    if (!this.skipRendering || this.renderToScreen) {
      material.uniforms.inputBuffer.value = inputBuffer.texture;
      material.uniforms.time.value = (time <= this.maxTime) ? time : this.minTime;
      renderer.render(this.scene, this.camera, this.renderToScreen ? undefined : outputBuffer);
    }
  }

  /**
   * Updates the size of this pass.
   *
   * @param width - The width.
   * @param height - The height.
   */
  setSize(
    width: number,
    height: number
  ) {
    this.getFullscreenMaterial().setSize(width, height);

    for (const effect of this.effects) {
      effect.setSize(width, height);
    }
  }

  /**
   * Performs initialization tasks.
   *
   * @param renderer - The renderer.
   * @param alpha - Whether the renderer uses the alpha channel or not.
   */
  initialize(
    renderer: WebGLRenderer,
    alpha: boolean
  ) {
    const capabilities = renderer.capabilities;

    let max = Math.min(capabilities.maxFragmentUniforms, capabilities.maxVertexUniforms);

    if (this.uniforms > max) {
      console.warn('The current rendering context doesn\'t support more than ' + max + ' uniforms, but ' + this.uniforms + ' were defined');
    }

    max = capabilities.maxVaryings;

    if (this.varyings > max) {
      console.warn('The current rendering context doesn\'t support more than ' + max + ' varyings, but ' + this.varyings + ' were defined');
    }

    for (const effect of this.effects) {
      effect.initialize(renderer, alpha);
    }
  }

  /**
   * Deletes disposable objects.
   *
   * This pass will be inoperative after this method was called!
   */
  dispose() {
    super.dispose();

    for (const effect of this.effects) {
      effect.dispose();
    }
  }
}
