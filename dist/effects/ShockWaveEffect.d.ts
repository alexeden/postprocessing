import { Vector3, Camera, WebGLRenderTarget, WebGLRenderer } from 'three';
import { Effect } from './Effect';
export interface ShockWaveEffectOptions {
    /** The animation speed. Default is 2. */
    speed: number;
    /** The extent of the shock wave. Default is 1. */
    maxRadius: number;
    /** The wave size. Default is 0.2. */
    waveSize: number;
    /** The distortion amplitude. Default is 0.05. */
    amplitude: number;
}
/**
 * A shock wave effect.
 *
 * Warning! This effect cannot be merged with convolution effects.
 *
 * Based on a Gist by Jean-Philippe Sarda: https://gist.github.com/jpsarda/33cea67a9f2ecb0a0eda
 */
export declare class ShockWaveEffect extends Effect {
    camera: Camera;
    epicenter: Vector3;
    speed: number;
    /**
     * The object position in screen space.
     */
    private screenPosition;
    /**
     * Time accumulator.
     */
    private time;
    /**
     * Indicates whether the shock wave animation is active.
     */
    private active;
    /**
     * Constructs a new shock wave effect.
     *
     * @param camera - The main camera.
     * @param epicenter - The world position of the shock wave epicenter.
     * @param options - The options.
     */
    constructor(camera: Camera, epicenter?: Vector3, { speed, maxRadius, waveSize, amplitude, }?: Partial<ShockWaveEffectOptions>);
    /**
     * Emits the shock wave.
     */
    explode(): void;
    update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, delta: number): void;
}
