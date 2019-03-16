import { RawImageData } from '../../RawImageData';
/**
 * SMAA search image data.
 *
 * This image stores information about how many pixels the line search
 * algorithm must advance in the last step.
 *
 * Based on the official python scripts:
 * https://github.com/iryoku/smaa/tree/master/Scripts
 */
export declare class SMAASearchImageData {
    /**
     * Creates a new search image.
     * @return The generated image data.
     */
    static generate(): RawImageData;
    /**
     * This dictionary returns which edges are active for a certain bilinear fetch:
     * it's the reverse lookup of the bilinear function.
     */
    private static edges;
}
