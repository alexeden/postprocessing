import { ColorEdgesMaterial } from './color-edges/ColorEdgesMaterial';
import { ConvolutionMaterial, KernelSize } from './convolution/ConvolutionMaterial';
import { CopyMaterial } from './copy/CopyMaterial';
import { EffectMaterial } from './effect/EffectMaterial';
import { LuminanceMaterial } from './luminance/LuminanceMaterial';
import { SMAAWeightsMaterial } from './smaa-weights/SMAAWeightsMaterial';
export declare type PostprocessingMaterial = ColorEdgesMaterial | ConvolutionMaterial | CopyMaterial | EffectMaterial | LuminanceMaterial | SMAAWeightsMaterial;
export { ColorEdgesMaterial, ConvolutionMaterial, CopyMaterial, EffectMaterial, KernelSize, LuminanceMaterial, SMAAWeightsMaterial, };
