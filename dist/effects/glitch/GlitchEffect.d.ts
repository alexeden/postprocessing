import { DataTexture, Vector2, Texture, WebGLRenderTarget, WebGLRenderer, EventDispatcher } from 'three';
import { BlendFunction } from '../../blending';
import { Effect } from '../../core';
export interface GlitchEffectOptions {
    /** The blend function of this effect. */
    blendFunction: BlendFunction;
    /** A chromatic aberration offset. If provided, the glitch effect will influence this offset. */
    chromaticAberrationOffset: Vector2 | null;
    /** The scale of the blocky glitch columns. */
    columns: number;
    /** The minimum and maximum delay between glitch activations in seconds. */
    delay: Vector2;
    /** The size of the generated noise map. Will be ignored if a perturbation map is provided. */
    dtSize: number;
    /** The minimum and maximum duration of a glitch in seconds. */
    duration: Vector2;
    /** A perturbation map. If none is provided, a noise texture will be created. */
    perturbationMap: Texture | null;
    /** The threshold for strong glitches. */
    ratio: number;
    /** The strength of weak and strong glitches. */
    strength: Vector2;
}
interface GlitchEffectEventMap {
    glitchstart: {
        type: 'glitchstart';
    };
    glitchend: {
        type: 'glitchend';
    };
}
export declare enum GlitchMode {
    /** No glitches. */
    DISABLED = 0,
    /** Sporadic glitches. */
    SPORADIC = 1,
    /** Constant mild glitches. */
    CONSTANT_MILD = 2,
    /** Constant wild glitches. */
    CONSTANT_WILD = 3
}
/**
 * A glitch effect. Can be used to influence the {@link ChromaticAberrationEffect}. *
 * Reference: https://github.com/staffantan/unityglitch
 * Warning: This effect cannot be merged with convolution effects.
 */
export declare class GlitchEffect extends Effect implements Omit<EventDispatcher, 'dispatchEvent'> {
    /**
     * A label for generated data textures.
     */
    private static generatedTexture;
    delay: Vector2;
    duration: Vector2;
    mode: GlitchMode;
    /**
     * The strength of weak and strong glitches.
     */
    strength: Vector2;
    chromaticAberrationOffset: Vector2 | null;
    /**
     * The threshold for strong glitches, ranging from 0 to 1 where 0 means no
     * weak glitches and 1 means no strong ones. The default ratio of 0.85
     * offers a decent balance.
     */
    ratio: number;
    private breakPoint;
    private distortion;
    private perturbationMap;
    /**
     * Random seeds.
     */
    private seed;
    /**
     * A time accumulator.
     */
    private time;
    private readonly dispatcher;
    constructor({ blendFunction, chromaticAberrationOffset, delay, duration, strength, columns, ratio, perturbationMap, dtSize, }?: Partial<GlitchEffectOptions>);
    /**
     * Indicates whether the glitch effect is currently active.
     */
    get active(): boolean;
    /**
     * Returns the current perturbation map.
     */
    getPerturbationMap(): Texture;
    /**
     * Replaces the current perturbation map with the given one.
     * The current map will be disposed if it was generated by this effect.
     */
    setPerturbationMap(perturbationMap: Texture): void;
    generatePerturbationMap(size?: number): DataTexture;
    update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, delta: number): void;
    addEventListener<K extends keyof GlitchEffectEventMap>(type: K, listener: (this: Effect, ev: GlitchEffectEventMap[K]) => void): void;
    hasEventListener<K extends keyof GlitchEffectEventMap>(type: K, listener: (this: Effect, ev: GlitchEffectEventMap[K]) => void): any;
    removeEventListener<K extends keyof GlitchEffectEventMap>(type: K, listener: (this: Effect, ev: GlitchEffectEventMap[K]) => void): void;
}
export {};
