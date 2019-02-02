export * from './lib';

// export { AdaptiveLuminanceMaterial } from './AdaptiveLuminanceMaterial';
// export { ColorEdgesMaterial } from './ColorEdgesMaterial';
// export { ConvolutionMaterial, KernelSize } from './ConvolutionMaterial';
import { CopyMaterial } from './CopyMaterial';
// export { DepthComparisonMaterial } from './DepthComparisonMaterial';
import { EffectMaterial } from './EffectMaterial';
// export { GodRaysMaterial } from './GodRaysMaterial';
// export { LuminanceMaterial } from './LuminanceMaterial';
// export { OutlineEdgesMaterial } from './OutlineEdgesMaterial';
// export { SMAAWeightsMaterial } from './SMAAWeightsMaterial';

export type PostprocessingMaterial
  = CopyMaterial
  | EffectMaterial;

export {
  CopyMaterial,
  EffectMaterial,
};
