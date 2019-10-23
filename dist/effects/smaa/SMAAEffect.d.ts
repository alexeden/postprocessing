import { WebGLRenderTarget, WebGLRenderer } from 'three';
import { Effect } from '../../core';
import { ShaderPass } from '../../passes';
/**
 * Subpixel Morphological Antialiasing (SMAA) v2.8.
 *
 * Preset: SMAA 1x Medium (with color edge detection).
 * https://github.com/iryoku/smaa/releases/tag/v2.8
 */
export declare class SMAAEffect extends Effect {
    /**
     * A render target for the color edge detection.
     */
    private renderTargetColorEdges;
    /**
     * A render target for the SMAA weights.
     */
    private renderTargetWeights;
    /**
     * A clear pass for the color edges buffer.
     */
    private clearPass;
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
    constructor(searchImage: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, areaImage: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement);
    /**
     * Sets the edge detection sensitivity.
     * See {@link ColorEdgesMaterial#setEdgeDetectionThreshold} for more details.
     *
     * @param threshold - The edge detection sensitivity. Range: [0.05, 0.5].
     */
    setEdgeDetectionThreshold(threshold: number): void;
    /**
     * Sets the maximum amount of horizontal/vertical search steps.
     * See {@link SMAAWeightsMaterial#setOrthogonalSearchSteps} for more details.
     *
     * @param steps - The search steps. Range: [0, 112].
     */
    setOrthogonalSearchSteps(steps: number): void;
    update(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget): void;
    setSize(width: number, height: number): void;
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
    static get searchImageDataURL(): string;
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
    static get areaImageDataURL(): string;
}
