/**
 * A container for raw image data.
 */
export declare class RawImageData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    /** The amount of color channels used per pixel. Range [1, 4]. */
    channels: number;
    constructor(width: number, height: number, data: Uint8ClampedArray, 
    /** The amount of color channels used per pixel. Range [1, 4]. */
    channels?: number);
    /**
     * Creates a canvas from this image data.
     * @return The canvas or null if it couldn't be created.
     */
    toCanvas(): HTMLCanvasElement | null;
}
