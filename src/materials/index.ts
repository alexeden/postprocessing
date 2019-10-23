// export { AdaptiveLuminanceMaterial } from './AdaptiveLuminanceMaterial';
import { ColorEdgesMaterial } from './color-edges/ColorEdgesMaterial';
import { ConvolutionMaterial, KernelSize } from './convolution/ConvolutionMaterial';
import { CopyMaterial } from './copy/CopyMaterial';
// export { DepthComparisonMaterial } from './DepthComparisonMaterial';
import { EffectMaterial } from './effect/EffectMaterial';
// export { GodRaysMaterial } from './god-rays/GodRaysMaterial';
// export { LuminanceMaterial } from './luminance/LuminanceMaterial';
// export { OutlineEdgesMaterial } from './outline-edges/OutlineEdgesMaterial';
import { SMAAWeightsMaterial } from './smaa-weights/SMAAWeightsMaterial';

export type PostprocessingMaterial
  = ColorEdgesMaterial
  | ConvolutionMaterial
  | CopyMaterial
  | EffectMaterial
  | SMAAWeightsMaterial;

export {
  ColorEdgesMaterial,
  ConvolutionMaterial,
  CopyMaterial,
  EffectMaterial,
  KernelSize,
  SMAAWeightsMaterial,
};
