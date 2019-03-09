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
   * An override clear color.
   */
  overrideClearColor: Color | null = null;

  /**
   * An override clear alpha.
   */
  overrideClearAlpha = 0.0;

  /**
   * Constructs a new clear pass.
   *
   * @param color - Determines whether the color buffer should be cleared.
   * @param depth - Determines whether the depth buffer should be cleared.
   * @param stencil - Determines whether the stencil buffer should be cleared.
   */
  constructor(
    public color = true,
    public depth = true,
    public stencil = false
  ) {
    super(PassName.Clear);
    this.needsSwap = false;
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
    const overrideClearColor = this.overrideClearColor;

    let clearAlpha;

    if (overrideClearColor !== null) {
      ClearPass.color.copy(renderer.getClearColor());
      clearAlpha = renderer.getClearAlpha();
      renderer.setClearColor(overrideClearColor, this.overrideClearAlpha);
    }

    renderer.setRenderTarget(this.renderToScreen ? undefined : inputBuffer);
    renderer.clear(this.color, this.depth, this.stencil);

    if (overrideClearColor !== null) {
      renderer.setClearColor(ClearPass.color, clearAlpha);
    }
  }
}
