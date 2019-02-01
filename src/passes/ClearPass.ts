import { Color, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from './Pass';
import { PassName } from './lib';

export interface ClearPassOptions {
  /** An override clear alpha. */
  clearAlpha: number;
  /** An override clear color. */
  clearColor: Color | null;
}

/**
 * A pass that clears the input buffer or the screen.
 *
 * You can prevent specific bits from being cleared by setting either the
 * `autoClearColor`, `autoClearStencil` or `autoClearDepth` properties of the renderer
 * to `false`.
 */
export class ClearPass extends Pass {
  /** Used for saving the original clear color of the renderer. */
  private static color = new Color();

  /**
   * Constructs a new clear pass.
   * @param options - Additional options.
   */
  constructor(
    partialOptions: Partial<ClearPassOptions> = { }
  ) {
    super(PassName.Clear);

    const options: ClearPassOptions = {
      clearAlpha: 0,
      clearColor: null,
      ...partialOptions,
    };

    this.needsSwap = false;
    this.clearColor = options.clearColor;
    this.clearAlpha = options.clearAlpha;
  }

  /**
   * Clears the input buffer or the screen.
   *
   * @param renderer - The renderer.
   * @param inputBuffer - A frame buffer that contains the result of the previous pass.
   */
  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget
  ) {
    const clearColor = this.clearColor;

    let clearAlpha;

    if (clearColor !== null) {
      ClearPass.color.copy(renderer.getClearColor());
      clearAlpha = renderer.getClearAlpha();
      renderer.setClearColor(clearColor, this.clearAlpha);
    }

    renderer.setRenderTarget(this.renderToScreen ? undefined : inputBuffer);
    renderer.clear();

    if (clearColor !== null) {
      renderer.setClearColor(ClearPass.color, clearAlpha);
    }
  }
}
