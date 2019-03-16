import { Uniform, Vector2 } from 'three';
import { BlendFunction } from './blending';
import { Effect } from './Effect';
import fragment from './glsl/scanlines.frag';
import { EffectName } from './lib';

export interface ScanlineEffectOptions {
  /** The blend function of this effect. Default si BlendFunction.OVERLAY. */
  blendFunction: BlendFunction;
  /** The scanline density. Default is 1.25. */
  density: number;
}

export class ScanlineEffect extends Effect {
  private density: number;
  private resolution: Vector2;

  constructor(
    {
      blendFunction = BlendFunction.OVERLAY,
      density = 1.25,
    }: Partial<ScanlineEffectOptions> = { }
  ) {
    super(EffectName.Scanline, fragment, {
      blendFunction,
      uniforms: new Map([
        ['count', new Uniform(0.0)],
      ]),
    });

    this.resolution = new Vector2();
    this.density = density;
  }

  /**
   * Returns the current scanline density.
   */
  getDensity() {
    return this.density;
  }

  /**
   * Sets the scanline density.
   */
  setDensity(density: number) {
    this.density = density;
    this.setSize(this.resolution.x, this.resolution.y);
  }

  setSize(
    width: number,
    height: number
  ) {
    this.resolution.set(width, height);
    this.uniforms.get('count')!.value = Math.round(height * this.density);
  }
}
