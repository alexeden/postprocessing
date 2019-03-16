import { Texture, WebGLRenderer, WebGLRenderTarget } from 'three';
import { BlendFunction, BlendMode } from '../blending';
import { Initializable, Resizable, Disposable, PreprocessorMacros, ShaderUniforms, EffectOptions } from './types';
import { EffectAttribute, WebGLExtension, EffectName } from './constants';

/**
 * An abstract effect.
 * Effects can be combined using the {@link EffectPass}.
 */
export abstract class Effect implements Initializable, Resizable, Disposable {
  // tslint:disable-next-line:no-any
  [k: string]: any;

  /**
   * The effect attributes.
   *
   * Effects that have the same attributes will be executed in the order in
   * which they were registered. Some attributes imply a higher priority.
   */
  attributes: EffectAttribute;
  vertexShader: VertexShader | null = null;

  /**
   * Preprocessor macro definitions.
   * You'll need to call {@link EffectPass#recompile} after changing a macro.
   */
  defines: PreprocessorMacros;

  /**
   * Shader uniforms.
   * You may freely modify the values of these uniforms at runtime. However,
   * uniforms must not be removed or added after the effect was created.
   */
  uniforms: ShaderUniforms;

  /**
   * WebGL extensions that are required by this effect.
   * You'll need to call {@link EffectPass#recompile} after adding or removing
   * an extension.
   */
  extensions: Set<WebGLExtension>;

  /**
   * The blend mode of this effect.
   *
   * The result of this effect will be blended with the result of the previous
   * effect using this blend mode.
   *
   * Feel free to adjust the opacity of the blend mode at runtime. However,
   * you'll need to call {@link EffectPass#recompile} if you change the blend
   * function.
   */
  blendMode: BlendMode;

  constructor(
    readonly name: EffectName,
    readonly fragmentShader: FragmentShader,
    partialOptions: Partial<EffectOptions> = { }
  ) {
    const settings: EffectOptions = {
      attributes: EffectAttribute.NONE,
      blendFunction: BlendFunction.SCREEN,
      defines: new Map(),
      uniforms: new Map(),
      extensions: new Set(),
      vertexShader: null,
      ...partialOptions,
    };

    this.attributes = settings.attributes;
    this.vertexShader = settings.vertexShader;
    this.defines = settings.defines;
    this.uniforms = settings.uniforms;
    this.extensions = settings.extensions;
    this.blendMode = new BlendMode(settings.blendFunction);
  }

  /**
   * @virtual Sets the depth texture.
   *
   * You may override this method if your effect requires direct access to the
   * depth texture that is bound to the associated {@link EffectPass}.
   */
  setDepthTexture(
    depthTexture: Texture | null,
    depthPacking = 0
  ) { }

  /**
   * @virtual Updates the effect by performing supporting operations.
   *
   * This method is called by the {@link EffectPass} right before the main
   * fullscreen render operation, even if the blend function is set to `SKIP`.
   *
   * You may override this method if you need to render additional off-screen
   * textures or update custom uniforms.
   *
   * @param renderer - The renderer.
   * @param inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param delta - The time between the last frame and the current one in seconds.
   */
  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    delta: number = 0
  ) { }

  /**
   * @virtual Updates the size of this effect.
   *
   * You may override this method in case you want to be informed about the main
   * render size.
   *
   * The {@link EffectPass} calls this method before this effect is initialized
   * and every time its own size is updated.
   */
  setSize(
    width: number,
    height: number
  ) { }

  /**
   * @virtual Performs initialization tasks.
   *
   * By overriding this method you gain access to the renderer. You'll also be
   * able to configure your custom render targets to use the appropriate format
   * (RGB or RGBA).
   *
   * The provided renderer can be used to warm up special off-screen render
   * targets by performing a preliminary render operation.
   *
   * The {@link EffectPass} calls this method during its own initialization
   * which happens after the size has been set.
   *
   * @param renderer - The renderer.
   * @param alpha - Whether the renderer uses the alpha channel or not.
   * @example if(!alpha) this.myRenderTarget.texture.format = RGBFormat;
   */
  initialize(
    renderer: WebGLRenderer,
    alpha: boolean
  ) { }

  /**
   * Performs a shallow search for properties that define a dispose method and
   * deletes them. The effect will be inoperative after this method was called!
   *
   * Disposable objects:
   *  - render targets
   *  - materials
   *  - textures
   *
   * The {@link EffectPass} calls this method when it is being destroyed. Do not
   * call this method directly.
   */
  dispose() {
    for (const key of Object.keys(this)) {
      if (this[key] !== null && typeof this[key].dispose === 'function') {
        this[key].dispose();
        this[key] = null;
      }
    }
  }
}
