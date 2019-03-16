import { WebGLRenderer, Uniform } from 'three';
import { EffectAttribute, WebGLExtension } from './constants';
import { BlendFunction } from 'blending';
/**
 * The Disposable contract.
 * Implemented by objects that can free internal resources.
 */
export interface Disposable {
    /**
     * Frees internal resources.
     */
    dispose(): void;
}
/**
 * The Resizable contract.
 * Implemented by objects that can be resized.
 */
export interface Resizable {
    /**
     * Sets the size of this object.
     *
     * @param width - The new width.
     * @param height - The new height.
     */
    setSize(width: number, height: number): void;
}
/**
 * The initializable contract.
 * Implemented by objects that can be initialized.
 */
export interface Initializable {
    /**
     * Performs initialization tasks.
     *
     * @param renderer - A renderer.
     * @param alpha - Whether the renderer uses the alpha channel.
     */
    initialize(renderer: WebGLRenderer, alpha: boolean): void;
}
export declare type PreprocessorMacros = Map<string, string>;
export declare type ShaderUniforms = Map<string, Uniform>;
export interface EffectOptions {
    /** The effect attributes that determine the execution priority and resource requirements. */
    attributes: EffectAttribute;
    /** The blend function of this effect. */
    blendFunction: BlendFunction;
    /** Custom preprocessor macro definitions. Keys are names and values are code. */
    defines: PreprocessorMacros;
    /** Custom shader uniforms. Keys are names and values are uniforms. */
    uniforms: ShaderUniforms;
    /** WebGL extensions. */
    extensions: Set<WebGLExtension>;
    /** The vertex shader. Most effects don't need one. */
    vertexShader: string | null;
}
