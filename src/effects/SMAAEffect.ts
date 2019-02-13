import {
  Color,
  LinearFilter,
  NearestFilter,
  RGBAFormat,
  RGBFormat,
  Texture,
  Uniform,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';

import { ColorEdgesMaterial, SMAAWeightsMaterial } from '../materials';
import { ClearPass, ShaderPass } from '../passes';
import { BlendFunction } from './blending/BlendFunction';
import { EffectAttribute, EffectName } from './lib';
import { Effect } from './Effect';

import searchImageDataURL from '../images/smaa/searchImageDataURL';
import areaImageDataURL from '../images/smaa/areaImageDataURL';

import fragment from './glsl/smaa/shader.frag';
import vertex from './glsl/smaa/shader.vert';


/**
 * Subpixel Morphological Antialiasing (SMAA) v2.8.
 *
 * Preset: SMAA 1x Medium (with color edge detection).
 * https://github.com/iryoku/smaa/releases/tag/v2.8
 */
export class SMAAEffect extends Effect {
  /**
   * A render target for the color edge detection.
   */
  private renderTargetColorEdges: WebGLRenderTarget;

  /**
   * A render target for the SMAA weights.
   */
  private renderTargetWeights: WebGLRenderTarget;

  /**
   * A clear pass for the color edges buffer.
   */
  private clearPass: ClearPass;

  /**
   * A color edge detection pass.
   */
  colorEdgesPass: ShaderPass;

  /**
   * An SMAA weights pass.
   */
  weightsPass: ShaderPass;


  /**
   * Constructs a new SMAA effect.
   *
   * @param searchImage - The SMAA search image. Preload this image using the {@link searchImageDataURL}.
   * @param areaImage - The SMAA area image. Preload this image using the {@link areaImageDataURL}.
   */
  constructor(
    searchImage: HTMLImageElement | HTMLCanvasElement | string,
    areaImage: HTMLImageElement | HTMLCanvasElement | string
  ) {
    super(EffectName.SMAA, fragment, {
      attributes: EffectAttribute.CONVOLUTION,
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['weightMap', new Uniform(null)],
      ]),
      vertexShader: vertex,
    });

    this.renderTargetColorEdges = new WebGLRenderTarget(1, 1, {
      minFilter: LinearFilter,
      format: RGBFormat,
      stencilBuffer: false,
      depthBuffer: false,
    });
    this.renderTargetColorEdges.texture.name = 'SMAA.ColorEdges';
    this.renderTargetColorEdges.texture.generateMipmaps = false;

    this.renderTargetWeights = this.renderTargetColorEdges.clone();
    this.renderTargetWeights.texture.name = 'SMAA.Weights';
    this.renderTargetWeights.texture.format = RGBAFormat;

    this.uniforms.get('weightMap')!.value = this.renderTargetWeights.texture;

    this.clearPass = new ClearPass({
      clearColor: new Color(0x000000),
      clearAlpha: 1.0,
    });

    this.colorEdgesPass = new ShaderPass(new ColorEdgesMaterial());
    this.weightsPass = new ShaderPass(new SMAAWeightsMaterial());

    this.weightsPass.getFullscreenMaterial().uniforms.searchTexture.value = (() => {
      const searchTexture = new Texture(searchImage);
      searchTexture.name = 'SMAA.Search';
      searchTexture.magFilter = NearestFilter;
      searchTexture.minFilter = NearestFilter;
      searchTexture.format = RGBAFormat;
      searchTexture.generateMipmaps = false;
      searchTexture.needsUpdate = true;
      searchTexture.flipY = false;

      return searchTexture;
    })();

    this.weightsPass.getFullscreenMaterial().uniforms.areaTexture.value = (() => {
      const areaTexture = new Texture(areaImage);
      areaTexture.name = 'SMAA.Area';
      areaTexture.minFilter = LinearFilter;
      areaTexture.format = RGBAFormat;
      areaTexture.generateMipmaps = false;
      areaTexture.needsUpdate = true;
      areaTexture.flipY = false;

      return areaTexture;
    })();
  }

  /**
   * Sets the edge detection sensitivity.
   * See {@link ColorEdgesMaterial#setEdgeDetectionThreshold} for more details.
   *
   * @param threshold - The edge detection sensitivity. Range: [0.05, 0.5].
   */
  setEdgeDetectionThreshold(threshold: number) {
    this.colorEdgesPass.getFullscreenMaterial().setEdgeDetectionThreshold(threshold);
  }

  /**
   * Sets the maximum amount of horizontal/vertical search steps.
   * See {@link SMAAWeightsMaterial#setOrthogonalSearchSteps} for more details.
   *
   * @param steps - The search steps. Range: [0, 112].
   */
  setOrthogonalSearchSteps(steps: number) {
    this.weightsPass.getFullscreenMaterial().setOrthogonalSearchSteps(steps);
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget
  ) {
    this.clearPass.render(renderer, this.renderTargetColorEdges);
    this.colorEdgesPass.render(renderer, inputBuffer, this.renderTargetColorEdges);
    this.weightsPass.render(renderer, this.renderTargetColorEdges, this.renderTargetWeights);
  }

  setSize(
    width: number,
    height: number
  ) {
    this.renderTargetColorEdges.setSize(width, height);
    this.renderTargetWeights.setSize(width, height);

    this.colorEdgesPass.getFullscreenMaterial().uniforms.texelSize.value.copy(
      this.weightsPass.getFullscreenMaterial().uniforms.texelSize.value.set(
        1.0 / width, 1.0 / height
      )
    );
  }

  /**
   * The SMAA search image, encoded as a base64 data URL.
   *
   * Use this image data to create an Image instance and use it together with
   * the area image to create an {@link SMAAEffect}.
   *
   * @example
   * const searchImage = new Image();
   * searchImage.addEventListener("load", progress);
   * searchImage.src = SMAAEffect.searchImageDataURL;
   */
  static get searchImageDataURL() {
    return searchImageDataURL;
  }

  /**
   * The SMAA area image, encoded as a base64 data URL.
   *
   * Use this image data to create an Image instance and use it together with
   * the search image to create an {@link SMAAEffect}.
   *
   * @example
   * const areaImage = new Image();
   * areaImage.addEventListener("load", progress);
   * areaImage.src = SMAAEffect.areaImageDataURL;
   */
  static get areaImageDataURL() {
    return areaImageDataURL;
  }
}
