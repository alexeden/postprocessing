import { Uniform } from 'three';
import { Effect, BlendFunction, BlendMode, EffectAttribute } from '../../effects';
export interface IntegratedEffect {
    /** The varyings used by the given effect. */
    varyings: string[];
    /** Indicates whether the effect transforms UV coordinates in the fragment shader. */
    transformedUv: boolean;
    /** Indicates whether the effect actually uses depth in the fragment shader. */
    readDepth: boolean;
}
/**
 * Integrates the given effect.
 *
 * @param prefix - A prefix.
 * @param effect - An effect.
 * @param shaderParts - The shader parts.
 * @param blendModes - The blend modes.
 * @param defines - The macro definitions.
 * @param uniforms - The uniforms.
 * @param attributes - The global, collective attributes.
 * @return The results.
 */
export declare function integrateEffect(prefix: string, effect: Effect, shaderParts: Map<string, string>, blendModes: Map<BlendFunction, BlendMode>, defines: Map<string, string>, uniforms: Map<string, Uniform>, attributes: EffectAttribute): IntegratedEffect;
