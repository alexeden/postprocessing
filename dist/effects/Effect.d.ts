import { Texture, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Initializable, Resizable, Disposable } from '../core';
import { BlendMode } from './blending';
import { EffectAttribute, EffectName, EffectOptions, PreprocessorMacros, ShaderUniforms, WebGLExtension } from './lib';
/**
 * An abstract effect.
 * Effects can be combined using the {@link EffectPass}.
 */
export declare abstract class Effect implements Initializable, Resizable, Disposable {
    readonly name: EffectName;
    readonly fragmentShader: FragmentShader;
    [k: string]: any;
    /**
     * The effect attributes.
     *
     * Effects that have the same attributes will be executed in the order in
     * which they were registered. Some attributes imply a higher priority.
     */
    attributes: EffectAttribute;
    vertexShader: VertexShader | null;
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
    constructor(name: EffectName, fragmentShader: FragmentShader, partialOptions?: Partial<EffectOptions>);
    /**
     * Sets the depth texture.
     *
     * You may override this method if your effect requires direct access to the
     * depth texture that is bound to the associated {@link EffectPass}.
     */
    setDepthTexture(depthTexture: Texture, depthPacking?: number): void;
    /**
     * Updates the effect by performing supporting operations.
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
    update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, delta?: number): void;
    /**
     * Updates the size of this effect.
     *
     * You may override this method in case you want to be informed about the main
     * render size.
     *
     * The {@link EffectPass} calls this method before this effect is initialized
     * and every time its own size is updated.
     */
    setSize(width: number, height: number): void;
    /**
     * Performs initialization tasks.
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
    initialize(renderer: WebGLRenderer, alpha: boolean): void;
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
    dispose(): void;
}
