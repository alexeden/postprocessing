const createCanvas = (
  width: number,
  height: number,
  data: Uint8ClampedArray,
  channels: number
): HTMLCanvasElement => {
  const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d')!;
  const imageData = context.createImageData(width, height);
  const target = imageData.data;

  let x;
  let y;
  let i;
  let j;

  for (y = 0; y < height; ++y) {
    for (x = 0; x < width; ++x) {
      i = (y * width + x) * 4;
      j = (y * width + x) * channels;
      target[i] = (channels > 0) ? data[j] : 0;
      target[i + 1] = (channels > 1) ? data[j + 1] : 0;
      target[i + 2] = (channels > 2) ? data[j + 2] : 0;
      target[i + 3] = (channels > 3) ? data[j + 3] : 255;
    }
  }

  canvas.width = width;
  canvas.height = height;
  context.putImageData(imageData, 0, 0);

  return canvas;
};

/**
 * A container for raw image data.
 */
export class RawImageData {
  constructor(
    public width = 0,
    public height = 0,
    public data: Uint8ClampedArray,
    /** The amount of color channels used per pixel. Range [1, 4]. */
    public channels = 4
  ) { }

  /**
   * Creates a canvas from this image data.
   * @return The canvas or null if it couldn't be created.
   */
  toCanvas(): HTMLCanvasElement | null {
    return (typeof document === 'undefined') ? null : createCanvas(
      this.width,
      this.height,
      this.data,
      this.channels
    );
  }
}
