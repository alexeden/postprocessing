import { BlendFunction } from '../blending';
import { Uniform } from 'three';
export declare enum EffectName {
    ChromaticAberration = "ChromaticAberrationEffect",
    Glitch = "GlitchEffect",
    Noise = "NoiseEffect",
    Scanline = "ScanlineEffect",
    SMAA = "SMAAEffect"
}
export declare type PreprocessorMacros = Map<string, string>;
export declare type ShaderUniforms = Map<string, Uniform>;
/**
 * An enumeration of effect attributes.
 * Attributes can be concatenated using the bitwise OR operator.
 *
 * @example
 * const attributes = EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH;
 */
export declare enum EffectAttribute {
    NONE = 0,
    /** Describes effects that require a depth texture. */
    DEPTH = 1,
    /**
     * Describes effects that fetch additional samples from the input buffer.
     * There cannot be more than one effect with this attribute per {@link EffectPass}.
     */
    CONVOLUTION = 2
}
/** An enumeration of WebGL extensions. */
export declare enum WebGLExtension {
    /** Enables derivatives by adding the functions dFdx, dFdy and fwidth. */
    DERIVATIVES = "derivatives",
    /** Enables gl_FragDepthEXT to set a depth value of a fragment from within the fragment shader. */
    FRAG_DEPTH = "fragDepth",
    /** Enables multiple render targets (MRT) support. */
    DRAW_BUFFERS = "drawBuffers",
    /** Enables explicit control of texture LOD. */
    SHADER_TEXTURE_LOD = "shaderTextureLOD"
}
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
