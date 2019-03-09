import { BlendFunction } from './blending';
import { Effect } from './Effect';
export interface ScanlineEffectOptions {
    /** The blend function of this effect. Default si BlendFunction.OVERLAY. */
    blendFunction: BlendFunction;
    /** The scanline density. Default is 1.25. */
    density: number;
}
export declare class ScanlineEffect extends Effect {
    private density;
    private resolution;
    constructor({ blendFunction, density, }?: Partial<ScanlineEffectOptions>);
    /**
     * Returns the current scanline density.
     */
    getDensity(): number;
    /**
     * Sets the scanline density.
     */
    setDensity(density: number): void;
    setSize(width: number, height: number): void;
}
