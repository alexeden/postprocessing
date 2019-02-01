/**
 * The Resizable contract.
 * Implemented by objects that can be resized.
 */
export interface Resizable {
    /**
     * Sets the size of this object.
     *
     * @param width - The new width.
     * @param height - The new height.
     */
    setSize(width: number, height: number): void;
}
