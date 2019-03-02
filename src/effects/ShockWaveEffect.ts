import { Uniform, Vector2, Vector3, Camera, WebGLRenderTarget, WebGLRenderer } from 'three';
import { Effect } from './Effect';

import fragment from './glsl/shock-wave/shader.frag';
import vertex from './glsl/shock-wave/shader.vert';
import { EffectName } from './lib';

const HALF_PI = Math.PI * 0.5;
const v = new Vector3();
const ab = new Vector3();

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
export class ShockWaveEffect extends Effect {
  speed: number;

  /**
   * The object position in screen space.
   */
  private screenPosition: Vector2;

  /**
   * Time accumulator.
   */
  private time = 0;

  /**
   * Indicates whether the shock wave animation is active.
   */
  private active = false;

  /**
   * Constructs a new shock wave effect.
   *
   * @param camera - The main camera.
   * @param epicenter - The world position of the shock wave epicenter.
   * @param options - The options.
   */
  constructor(
    public camera: Camera,
    public epicenter = new Vector3(),
    {
      speed = 2.0,
      maxRadius = 1.0,
      waveSize = 0.2,
      amplitude = 0.05,
    }: Partial<ShockWaveEffectOptions> = { }
  ) {
    super(EffectName.ShockWave, fragment, {
      uniforms: new Map([
        ['active', new Uniform(false)],
        ['center', new Uniform(new Vector2(0.5, 0.5))],
        ['cameraDistance', new Uniform(1.0)],
        ['size', new Uniform(1.0)],
        ['radius', new Uniform(-waveSize)],
        ['maxRadius', new Uniform(maxRadius)],
        ['waveSize', new Uniform(waveSize)],
        ['amplitude', new Uniform(amplitude)],
      ]),
      vertexShader: vertex,
    });

    this.screenPosition = this.uniforms.get('center')!.value;
    this.speed = speed;
  }

  /**
   * Emits the shock wave.
   */
  explode() {
    this.time = 0.0;
    this.active = true;
    this.uniforms.get('active')!.value = true;
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    delta: number
  ) {
    if (this.active) {
      const waveSize = this.uniforms.get('waveSize')!.value;

      // Calculate direction vectors.
      this.camera.getWorldDirection(v);
      ab.copy(this.camera.position).sub(this.epicenter);

      // Don't render the effect if the object is behind the camera.
      if (v.angleTo(ab) > HALF_PI) {
        // Scale the effect based on distance to the object.
        this.uniforms.get('cameraDistance')!.value = this.camera.position.distanceTo(this.epicenter);

        // Calculate the screen position of the epicenter.
        v.copy(this.epicenter).project(this.camera);
        this.screenPosition.set((v.x + 1.0) * 0.5, (v.y + 1.0) * 0.5);
      }

      // Update the shock wave radius based on time.
      this.time += delta * this.speed;
      const radius = this.time - waveSize;
      this.uniforms.get('radius')!.value = radius;

      if (radius >= (this.uniforms.get('maxRadius')!.value + waveSize) * 2.0) {
        this.active = false;
        this.uniforms.get('active')!.value = false;
      }
    }
  }
}
