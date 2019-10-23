import { ShaderMaterial, Vector2 } from 'three';
/**
 * A luminance shader material.
 *
 * This shader produces a greyscale luminance map that describes the absolute
 * amount of light emitted by a scene. It can also be configured to output
 * colours that are scaled with their respective luminance value. Additionally,
 * a range may be provided to mask out undesired texels.
 *
 * The alpha channel always contains the luminance value.
 *
 * On luminance coefficients:
 *  http://www.poynton.com/notes/colour_and_gamma/ColorFAQ.html#RTFToC9
 *
 * Coefficients for different colour spaces:
 *  https://hsto.org/getpro/habr/post_images/2ab/69d/084/2ab69d084f9a597e032624bcd74d57a7.png
 *
 * Luminance range reference:
 *  https://cycling74.com/2007/05/23/your-first-shader/#.Vty9FfkrL4Z
 */
export declare class LuminanceMaterial extends ShaderMaterial {
    /**
     * Constructs a new luminance material.
     *
     * @param [colorOutput=false] - Defines whether the shader should output colours scaled with their luminance value.
     * @param [luminanceRange] - If provided, the shader will mask out texels that aren't in the specified luminance range.
     */
    constructor(colorOutput?: boolean, luminanceRange?: Vector2 | null);
    /** The luminance threshold. */
    get threshold(): any;
    /** Sets the luminance threshold. */
    set threshold(value: any);
    /** The luminance threshold smoothing. */
    get smoothing(): any;
    /** Sets the luminance threshold smoothing. */
    set smoothing(value: any);
    /** Indicates whether the luminance threshold is enabled. */
    get useThreshold(): boolean;
    /** Enables or disables the luminance threshold. */
    set useThreshold(value: boolean);
    /** Indicates whether color output is enabled. */
    get colorOutput(): boolean;
    /** Enables or disables color output. */
    set colorOutput(value: boolean);
    /** Indicates whether luminance masking is enabled. */
    get useRange(): boolean;
    /**
     * Enables or disables luminance masking.
     * If enabled, the threshold will be ignored.
     */
    set useRange(value: boolean);
}
