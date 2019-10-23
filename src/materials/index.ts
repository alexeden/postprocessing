// export { AdaptiveLuminanceMaterial } from './AdaptiveLuminanceMaterial';
import { ColorEdgesMaterial } from './color-edges/ColorEdgesMaterial';
// export { ConvolutionMaterial, KernelSize } from './ConvolutionMaterial';
import { CopyMaterial } from './copy/CopyMaterial';
// export { DepthComparisonMaterial } from './DepthComparisonMaterial';
import { EffectMaterial } from './effect/EffectMaterial';
// export { GodRaysMaterial } from './god-rays/GodRaysMaterial';
// export { LuminanceMaterial } from './luminance/LuminanceMaterial';
// export { OutlineEdgesMaterial } from './outline-edges/OutlineEdgesMaterial';
import { SMAAWeightsMaterial } from './smaa-weights/SMAAWeightsMaterial';

export type PostprocessingMaterial
  = ColorEdgesMaterial
  | CopyMaterial
  | EffectMaterial
  | SMAAWeightsMaterial;

/**
 * A kernel size enumeration.
 */
export enum KernelSize {
  /** A very small kernel that matches a 7x7 Gauss blur kernel. */
  VERY_SMALL = 0,
  /** A small kernel that matches a 15x15 Gauss blur kernel. */
  SMALL = 1,
  /** A medium sized kernel that matches a 23x23 Gauss blur kernel. */
  MEDIUM = 2,
  /** A large kernel that matches a 35x35 Gauss blur kernel. */
  LARGE = 3,
  /** A very large kernel that matches a 63x63 Gauss blur kernel. */
  VERY_LARGE = 4,
  /** A huge kernel that matches a 127x127 Gauss blur kernel. */
  HUGE = 5,
}

export {
  ColorEdgesMaterial,
  CopyMaterial,
  EffectMaterial,
  SMAAWeightsMaterial,
};
