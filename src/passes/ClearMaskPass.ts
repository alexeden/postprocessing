import { WebGLRenderer } from 'three';
import { Pass, PassName } from '../core';

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
