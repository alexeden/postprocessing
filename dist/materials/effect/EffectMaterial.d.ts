import { PerspectiveCamera, ShaderMaterial, Uniform, Camera } from 'three';
import { Resizable, Section } from '../../core';
/**
 * An effect material for compound shaders.
 *
 * This material supports dithering.
 */
export declare class EffectMaterial extends ShaderMaterial implements Resizable {
    /**
     * Constructs a new effect material.
     *
     * @param shaderParts - A collection of shader snippets.
     * @param defines - A collection of preprocessor macro definitions.
     * @param uniforms - A collection of uniforms.
     * @param camera - A camera.
     * @param dithering - Whether dithering should be enabled.
     */
    constructor(shaderParts: Map<Section, string>, defines: Map<string, string>, uniforms: Map<string, Uniform>, camera?: Camera | PerspectiveCamera | null, dithering?: boolean);
    /**
     * The current depth packing.
     */
    get depthPacking(): number;
    /**
     * Sets the depth packing.
     *
     * Use `BasicDepthPacking` or `RGBADepthPacking` if your depth texture
     * contains packed depth.
     *
     * You'll need to call {@link EffectPass#recompile} after changing this value.
     */
    set depthPacking(value: number);
    /**
     * Sets the resolution.
     */
    setSize(unboundWidth: number, unboundHeight: number): void;
    /**
     * Adopts the settings of the given camera.
     */
    adoptCameraSettings(camera?: Camera | PerspectiveCamera | null): void;
}
