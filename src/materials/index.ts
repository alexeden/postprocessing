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

export {
  ColorEdgesMaterial,
  CopyMaterial,
  EffectMaterial,
  SMAAWeightsMaterial,
};
