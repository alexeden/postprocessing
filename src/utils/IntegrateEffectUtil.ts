// tslint:disable:prefer-template
import { Uniform } from 'three';
import { BlendFunction, BlendMode } from '../blending';
import { Effect, Section, EffectAttribute } from '../core';
import { findSubstrings } from './FindSubstringsUtil';
import { prefixSubstrings } from './PrefixSubstringsUtils';

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
export const integrateEffect = (
  prefix: string,
  effect: Effect,
  shaderParts: Map<string, string>,
  blendModes: Map<BlendFunction, BlendMode>,
  defines: Map<string, string>,
  uniforms: Map<string, Uniform>,
  attributes: EffectAttribute
): IntegratedEffect => {

  const functionRegExp = /(?:\w+\s+(\w+)\([\w\s,]*\)\s*{[^}]+})/g;
  const varyingRegExp = /(?:varying\s+\w+\s+(\w*))/g;

  const blendMode = effect.blendMode;
  const shaders = new Map([
    ['fragment', effect.fragmentShader],
    ['vertex', effect.vertexShader!],
  ]);

  const mainImageExists = effect.fragmentShader.includes('mainImage');
  const mainUvExists = effect.fragmentShader.includes('mainUv');

  let varyings: string[] = [];
  let names: string[] = [];
  let transformedUv = false;
  let readDepth = false;

  if (shaders.get('fragment') === undefined) {
    console.error('Missing fragment shader', effect);
  }
  else if (mainUvExists && (attributes & EffectAttribute.CONVOLUTION) !== 0) {
    console.error('Effects that transform UV coordinates are incompatible with convolution effects', effect);
  }
  else if (!mainImageExists && !mainUvExists) {
    console.error('The fragment shader contains neither a mainImage nor a mainUv function', effect);
  }
  else {
    if (mainUvExists) {
      shaderParts.set(
        Section.FRAGMENT_MAIN_UV,
        shaderParts.get(Section.FRAGMENT_MAIN_UV)! + '\t' + prefix + 'MainUv(UV);\n'
      );

      transformedUv = true;
    }

    if (shaders.get('vertex') !== null && shaders.get('vertex')!.indexOf('mainSupport') >= 0) {
      shaderParts.set(
        Section.VERTEX_MAIN_SUPPORT,
        shaderParts.get(Section.VERTEX_MAIN_SUPPORT) + '\t' + prefix + 'MainSupport();\n'
      );

      varyings = varyings.concat(findSubstrings(varyingRegExp, shaders.get('vertex')!));
      names = names.concat(varyings).concat(findSubstrings(functionRegExp, shaders.get('vertex')!));
    }

    names = names
      .concat(findSubstrings(functionRegExp, shaders.get('fragment')!))
      .concat(Array.from(effect.uniforms.keys()))
      .concat(Array.from(effect.defines.keys()));

    // Store prefixed uniforms and macros.
    effect.uniforms.forEach((value, key) => uniforms.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), value));
    effect.defines.forEach((value, key) => defines.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), value));

    // Prefix varyings, functions, uniforms and macros.
    prefixSubstrings(prefix, names, defines);
    prefixSubstrings(prefix, names, shaders);

    // Collect unique blend modes.
    blendModes.set(blendMode.blendFunction, blendMode);

    if (mainImageExists) {
      let str = prefix + 'MainImage(color0, UV, ';

      // The effect may sample depth in a different shader.
      if ((attributes & EffectAttribute.DEPTH) !== 0 && shaders.get('fragment')!.indexOf('depth') >= 0) {
        str += 'depth, ';
        readDepth = true;
      }

      str += 'color1);\n\t';

      // Include the blend opacity uniform of this effect.
      const blendOpacity = prefix + 'BlendOpacity';
      uniforms.set(blendOpacity, blendMode.opacity);

      // Blend the result of this effect with the input color.
      str += 'color0 = blend' + blendMode.blendFunction + '(color0, color1, ' + blendOpacity + ');\n\n\t';

      shaderParts.set(
        Section.FRAGMENT_MAIN_IMAGE,
        shaderParts.get(Section.FRAGMENT_MAIN_IMAGE) + str
      );

      shaderParts.set(
        Section.FRAGMENT_HEAD,
        shaderParts.get(Section.FRAGMENT_HEAD) + 'uniform float ' + blendOpacity + ';\n\n'
      );
    }

    // Include the modified code in the final shader.
    shaderParts.set(
      Section.FRAGMENT_HEAD,
      shaderParts.get(Section.FRAGMENT_HEAD)! + shaders.get('fragment') + '\n'
    );

    if (shaders.get('vertex') !== null) {
      shaderParts.set(
        Section.VERTEX_HEAD,
        shaderParts.get(Section.VERTEX_HEAD)! + shaders.get('vertex') + '\n'
      );
    }
  }

  return { varyings, transformedUv, readDepth };
};
