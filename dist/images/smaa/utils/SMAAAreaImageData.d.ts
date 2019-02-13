import { RawImageData } from '../../RawImageData';
/**
 * SMAA area image data.
 *
 * This texture allows to obtain the area for a certain pattern and distances
 * to the left and to the right of the identified line.
 *
 * Based on the official python scripts:
 *  https://github.com/iryoku/smaa/tree/master/Scripts
 */
export declare class SMAAAreaImageData {
    /**
     * Creates a new area image.
     * @return The generated image data.
     */
    static generate(): RawImageData;
}
