import { PerspectiveCamera, ShaderMaterial, Uniform, Vector2, Camera } from 'three';
import { Resizable } from '../core';
import { Section } from './lib';
import fragmentTemplate from './glsl/effect/shader.frag';
import vertexTemplate from './glsl/effect/shader.vert';

/**
 * An effect material for compound shaders.
 *
 * This material supports dithering.
 */
export class EffectMaterial extends ShaderMaterial implements Resizable {
  /**
   * Constructs a new effect material.
   *
   * @param shaderParts - A collection of shader snippets.
   * @param defines - A collection of preprocessor macro definitions.
   * @param uniforms - A collection of uniforms.
   * @param camera - A camera.
   * @param dithering - Whether dithering should be enabled.
   */
  constructor(
    shaderParts: Map<Section, string>,
    defines: Map<string, string>,
    uniforms: Map<string, Uniform>,
    camera: Camera | PerspectiveCamera | null = null,
    dithering = false
  ) {

    super({
      defines: {
        DEPTH_PACKING: '0',
      },
      uniforms: {
        inputBuffer: new Uniform(null),
        depthBuffer: new Uniform(null),

        resolution: new Uniform(new Vector2()),
        texelSize: new Uniform(new Vector2()),

        cameraNear: new Uniform(0.3),
        cameraFar: new Uniform(1000.0),
        aspect: new Uniform(1.0),
        time: new Uniform(0.0),
      },

      fragmentShader: fragmentTemplate
        .replace(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD)!)
        .replace(Section.FRAGMENT_MAIN_UV, shaderParts.get(Section.FRAGMENT_MAIN_UV)!)
        .replace(Section.FRAGMENT_MAIN_IMAGE, shaderParts.get(Section.FRAGMENT_MAIN_IMAGE)!),

      vertexShader: vertexTemplate
        .replace(Section.VERTEX_HEAD, shaderParts.get(Section.VERTEX_HEAD)!)
        .replace(Section.VERTEX_MAIN_SUPPORT, shaderParts.get(Section.VERTEX_MAIN_SUPPORT)!),

      dithering,
      depthWrite: false,
      depthTest: false,
    });

    if (defines !== null) {
      for (const entry of defines.entries()) {
        this.defines[entry[0]] = entry[1];
      }
    }

    if (uniforms !== null) {
      for (const entry of uniforms.entries()) {
        this.uniforms[entry[0]] = entry[1];
      }
    }

    this.adoptCameraSettings(camera);
  }

  /**
   * The current depth packing.
   */
  get depthPacking(): number {
    return Number.parseInt(this.defines.DEPTH_PACKING, 10);
  }

  /**
   * Sets the depth packing.
   *
   * Use `BasicDepthPacking` or `RGBADepthPacking` if your depth texture
   * contains packed depth.
   *
   * You'll need to call {@link EffectPass#recompile} after changing this value.
   */
  set depthPacking(value: number) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
  }

  /**
   * Sets the resolution.
   */
  setSize(
    unboundWidth: number,
    unboundHeight: number
  ) {
    const width = Math.max(unboundWidth, 1.0);
    const height = Math.max(unboundHeight, 1.0);

    this.uniforms.resolution.value.set(width, height);
    this.uniforms.texelSize.value.set(1.0 / width, 1.0 / height);
    this.uniforms.aspect.value = width / height;
  }

  /**
   * Adopts the settings of the given camera.
   */
  adoptCameraSettings(camera: Camera | PerspectiveCamera | null = null) {
    if (camera !== null) {
      if (camera instanceof PerspectiveCamera) {
        this.uniforms.cameraNear.value = camera.near;
        this.uniforms.cameraFar.value = camera.far;
        this.defines.PERSPECTIVE_CAMERA = '1';
      }
      else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
    }
  }
}
