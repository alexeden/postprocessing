import { WebGLRenderer } from 'three';
import { PassName } from './lib';
import { Pass } from './Pass';

/**
 * A pass that disables the stencil test.
 */
export class ClearMaskPass extends Pass {
  constructor() {
    super(PassName.ClearMask);
    this.needsSwap = false;
  }

  /**
   * Disables the global stencil test.
   */
  render(renderer: WebGLRenderer) {
    renderer.state.buffers.stencil.setTest(false);
  }
}
