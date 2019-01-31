import { WebGLRenderer } from 'three';

/**
 * The initializable contract.
 * Implemented by objects that can be initialized.
 */
export interface Initializable {
  /**
   * Performs initialization tasks.
   *
   * @param renderer - A renderer.
   * @param alpha - Whether the renderer uses the alpha channel.
   */
  initialize(renderer: WebGLRenderer, alpha: boolean): void;
}
