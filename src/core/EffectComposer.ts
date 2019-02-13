import {
  DepthStencilFormat,
  DepthTexture,
  LinearFilter,
  RGBAFormat,
  RGBFormat,
  UnsignedInt248Type,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';

import { ClearMaskPass, MaskPass, RenderPass, ShaderPass, Pass } from '../passes';
import { CopyMaterial } from '../materials';
import { Disposable } from './Disposable';
import { Resizable } from './Resizable';

interface EffectComposerOptions {
  /**
   * Whether the main render targets should have a depth buffer.
   */
  depthBuffer: boolean;
  /**
   * Whether the main render targets should have a stencil buffer.
   */
  stencilBuffer: boolean;
}

/**
 * The EffectComposer may be used in place of a normal WebGLRenderer.
 *
 * The auto clear behaviour of the provided renderer will be disabled to prevent
 * unnecessary clear operations.
 *
 * It is common practice to use a {@link RenderPass} as the first pass to
 * automatically clear the screen and render the scene to a texture for further
 * processing.
 */
export class EffectComposer implements Disposable, Resizable {
  /**
   * The input buffer.
   *
   * Reading from and writing to the same render target should be avoided.
   * Therefore, two seperate yet identical buffers are used.
   */
  inputBuffer: WebGLRenderTarget | null = null;

  /**
   * The output buffer.
   */
  outputBuffer: WebGLRenderTarget | null = null;

  /**
   * A copy pass used for copying masked scenes.
   */
  private copyPass = new ShaderPass(new CopyMaterial());

  /**
   * The passes.
   */
  private passes: Pass[] = [];

  /**
   * Constructs a new effect composer.
   * @param renderer- The renderer that should be used.
   * @param options - The options.
   */
  constructor(
    public renderer: WebGLRenderer | null = null,
    partialOptions: Partial<EffectComposerOptions> = { }
  ) {

    const options: EffectComposerOptions = {
      depthBuffer: true,
      stencilBuffer: false,
      ...partialOptions,
    };

    if (this.renderer !== null) {
      this.renderer.autoClear = false;
      this.inputBuffer = this.createBuffer(options.depthBuffer, options.stencilBuffer);
      this.outputBuffer = this.inputBuffer.clone();
    }
  }

  /**
   * Replaces the current renderer with the given one. The DOM element of the
   * current renderer will automatically be removed from its parent node and the
   * DOM element of the new renderer will take its place.
   *
   * The auto clear mechanism of the provided renderer will be disabled.
   *
   * @param renderer New renderer.
   * @return The old renderer.
   */
  replaceRenderer(renderer: WebGLRenderer): WebGLRenderer | null {
    const oldRenderer = this.renderer;
    let parent;
    let oldSize;
    let newSize;

    if (oldRenderer !== null && oldRenderer !== renderer) {
      this.renderer = renderer;
      this.renderer.autoClear = false;

      parent = oldRenderer.domElement.parentNode;
      oldSize = oldRenderer.getSize();
      newSize = renderer.getSize();

      if (parent !== null) {
        parent.removeChild(oldRenderer.domElement);
        parent.appendChild(renderer.domElement);
      }

      if (oldSize.width !== newSize.width || oldSize.height !== newSize.height) {
        this.setSize();
      }
    }

    return oldRenderer;
  }

  /**
   * Retrieves the most relevant depth texture for the pass at the given index.
   * @param index - The index of the pass that needs a depth texture.
   * @return The depth texture, or null if there is none.
   */
  private getDepthTexture(index: number): DepthTexture | null {
    const passes = this.passes;
    let depthTexture = null;
    let inputBuffer = true;
    let i;
    let pass;

    for (i = 0; i < index; ++i) {
      pass = passes[i];
      if (pass.needsSwap) {
        inputBuffer = !inputBuffer;
      }
      else if (pass instanceof RenderPass) {
        depthTexture = (inputBuffer ? this.inputBuffer! : this.outputBuffer!).depthTexture;
      }
    }

    return depthTexture;
  }

  /**
   * Creates two depth texture attachments, one for the input buffer and one for
   * the output buffer.
   *
   * Depth will be written to the depth texture when something is rendered into
   * the respective render target and the involved materials have `depthWrite`
   * enabled. Under normal circumstances, only a {@link RenderPass} will render
   * depth.
   *
   * When a shader reads from a depth texture and writes to a render target that
   * uses the same depth texture attachment, the depth information will be lost.
   * This happens even if `depthWrite` is disabled. For that reason, two
   * separate depth textures are used.
   */

  private createDepthTexture(width: number, height: number) {
    const depthTexture = new DepthTexture(width, height);

    if (this.inputBuffer!.stencilBuffer) {
      depthTexture.format = DepthStencilFormat;
      depthTexture.type = UnsignedInt248Type as any;
    }

    this.inputBuffer!.depthTexture = depthTexture;
    this.outputBuffer!.depthTexture = depthTexture.clone();
  }

  /**
   * Creates a new render target by replicating the renderer's canvas.
   *
   * The created render target uses a linear filter for texel minification and
   * magnification. Its render texture format depends on whether the renderer
   * uses the alpha channel. Mipmaps are disabled.
   *
   * @param depthBuffer - Whether the render target should have a depth buffer.
   * @param stencilBuffer - Whether the render target should have a stencil buffer.
   * @return A new render target that equals the renderer's canvas.
   */
  createBuffer(
    depthBuffer: boolean,
    stencilBuffer: boolean
  ): WebGLRenderTarget {

    const drawingBufferSize = this.renderer!.getDrawingBufferSize();
    const alpha = this.renderer!.context.getContextAttributes()!.alpha;

    const renderTarget = new WebGLRenderTarget(drawingBufferSize.width, drawingBufferSize.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: alpha ? RGBAFormat : RGBFormat,
      depthBuffer,
      stencilBuffer,
    });

    renderTarget.texture.name = 'EffectComposer.Buffer';
    renderTarget.texture.generateMipmaps = false;

    return renderTarget;

  }

  /**
   * Adds a pass, optionally at a specific index.
   *
   * @param pass - A new pass.
   * @param index - An index at which the pass should be inserted.
   */

  addPass(
    pass: Pass,
    index?: number
  ) {
    const drawingBufferSize = this.renderer!.getDrawingBufferSize();

    pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
    pass.initialize(this.renderer!, this.renderer!.context.getContextAttributes()!.alpha || false);

    if (index !== undefined) {
      this.passes.splice(index, 0, pass);
    }
    else {
      // tslint:disable-next-line:no-parameter-reassignment
      index = this.passes.push(pass) - 1;
    }

    if (pass.needsDepthTexture) {
      if (this.inputBuffer!.depthTexture === null) {
        this.createDepthTexture(drawingBufferSize.width, drawingBufferSize.height);
      }

      pass.setDepthTexture(this.getDepthTexture(index)!);
    }
  }

  /**
   * Removes a pass.
   */
  removePass(pass: Pass) {
    this.passes.splice(this.passes.indexOf(pass), 1);
  }

  /**
   * Renders all enabled passes in the order in which they were added.
   * @param delta - The time between the last frame and the current one in seconds.
   */
  render(delta: number) {
    let inputBuffer = this.inputBuffer!;
    let outputBuffer = this.outputBuffer!;

    let stencilTest = false;
    let context;
    let state;
    let buffer;

    for (const pass of this.passes) {
      if (pass.enabled) {
        pass.render(this.renderer!, inputBuffer, outputBuffer, delta, stencilTest);
        if (pass.needsSwap) {
          if (stencilTest) {
            this.copyPass.renderToScreen = pass.renderToScreen;
            context = this.renderer!.context;
            state = this.renderer!.state;
            // Preserve the unaffected pixels.
            state.buffers.stencil.setFunc(context.NOTEQUAL, 1, 0xffffffff);
            this.copyPass.render(this.renderer!, inputBuffer, outputBuffer);
            state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
          }

          buffer = inputBuffer;
          inputBuffer = outputBuffer;
          outputBuffer = buffer;
        }

        if (pass instanceof MaskPass) {
          stencilTest = true;
        }
        else if (pass instanceof ClearMaskPass) {
          stencilTest = false;
        }
      }
    }
  }

  /**
   * Sets the size of the buffers and the renderer's output canvas.
   *
   * Every pass will be informed of the new size. It's up to each pass how that
   * information is used.
   *
   * If no width or height is specified, the render targets and passes will be
   * updated with the current size of the renderer.
   */
  setSize(width?: number, height?: number) {
    let size;

    if (width === undefined || height === undefined) {
      size = this.renderer!.getSize();
      // tslint:disable-next-line:no-parameter-reassignment
      width = size.width;
      // tslint:disable-next-line:no-parameter-reassignment
      height = size.height;
    }

    // Update the logical render size.
    this.renderer!.setSize(width, height);

    // The drawing buffer size takes the device pixel ratio into account.
    const drawingBufferSize = this.renderer!.getDrawingBufferSize();

    this.inputBuffer!.setSize(drawingBufferSize.width, drawingBufferSize.height);
    this.outputBuffer!.setSize(drawingBufferSize.width, drawingBufferSize.height);

    for (const pass of this.passes) {
      pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
    }
  }

  /**
   * Resets this composer by deleting all passes and creating new buffers.
   */

  reset() {
    const renderTarget = this.createBuffer(
      this.inputBuffer!.depthBuffer,
      this.inputBuffer!.stencilBuffer
    );

    this.dispose();

    // Reanimate.
    this.inputBuffer = renderTarget;
    this.outputBuffer = renderTarget.clone();
    this.copyPass = new ShaderPass(new CopyMaterial());
  }

  /**
   * Destroys this composer and all passes.
   *
   * This method deallocates all disposable objects created by the passes. It
   * also deletes the main frame buffers of this composer.
   */

  dispose() {
    for (const pass of this.passes) pass.dispose();

    this.passes = [];

    if (this.inputBuffer !== null) {
      this.inputBuffer.dispose();
      this.inputBuffer = null;
    }

    if (this.outputBuffer !== null) {
      this.outputBuffer.dispose();
      this.outputBuffer = null;
    }

    this.copyPass.dispose();
  }

}
