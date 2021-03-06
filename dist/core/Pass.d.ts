import { Scene, WebGLRenderer, WebGLRenderTarget, Texture, Camera, IUniform } from 'three';
import { Disposable, Initializable, Resizable } from './types';
import { PostprocessingMaterial } from '../materials';
import { PassName } from './constants';
/**
 * An abstract pass.
 *
 * Passes that do not rely on the depth buffer should explicitly disable the
 * depth test and depth write in their respective shader materials.
 */
export declare abstract class Pass implements Disposable, Initializable, Resizable {
    protected readonly name: PassName;
    protected readonly scene: Scene;
    protected readonly camera: Camera;
    protected uniform: IUniform | null;
    /**
     * A quad mesh that fills the screen.
     */
    private quad;
    /**
     * Indicates whether the {@link EffectComposer} should swap the frame
     * buffers after this pass has finished rendering.
     *
     * Set this to `false` if this pass doesn't render to the output buffer or
     * the screen. Otherwise, the contents of the input buffer will be lost.
     *
     * This flag must not be changed at runtime.
     */
    needsSwap: boolean;
    /**
     * Indicates whether the {@link EffectComposer} should prepare a depth
     * texture for this pass.
     *
     * Set this to `true` if this pass relies on depth information from a
     * preceding {@link RenderPass}.
     */
    needsDepthTexture: boolean;
    /**
     * Indicates whether this pass should render to screen.
     */
    renderToScreen: boolean;
    /**
     * Indicates whether this pass should be executed.
     */
    enabled: boolean;
    /**
     * Constructs a new pass.
     *
     * @param - The name of this pass. Does not have to be unique.
     * @param - The scene to render. The default scene contains a single mesh that fills the screen.
     * @param - The camera. The default camera perfectly captures the screen mesh.
     */
    constructor(name: PassName, scene?: Scene, camera?: Camera);
    /**
     * Returns the current fullscreen material.
     *
     * @return The current fullscreen material(s), or null if there is none.
     */
    getFullscreenMaterial(): PostprocessingMaterial | PostprocessingMaterial[] | null;
    /**
     * Returns the current fullscreen material.
     *
     * @return The current fullscreen materials.
     */
    getFullscreenMaterials(): PostprocessingMaterial[];
    /**
     * Returns the current fullscreen material.
     *
     * @return The current fullscreen materials.
     */
    getFullscreenMaterialsOfType<T extends PostprocessingMaterial>(type: new (...args: any[]) => T): T[];
    /**
     * Sets the fullscreen material.
     *
     * The material will be assigned to the quad mesh that fills the screen. The
     * screen quad will be created once a material is assigned via this method.
     *
     * @param - A fullscreen material.
     */
    protected setFullscreenMaterial(material: PostprocessingMaterial): void;
    /**
     * Returns the current depth texture.
     *
     * @return The current depth texture, or null if there is none.
     */
    getDepthTexture(): Texture | null;
    /**
     * Sets the depth texture.
     *
     * You may override this method if your pass relies on the depth information
     * of a preceding {@link RenderPass}.
     *
     * @param depthTexture - A depth texture.
     * @param depthPacking - The depth packing. Default to `0`.
     */
    setDepthTexture(depthTexture: Texture | null, depthPacking?: number): void;
    /**
     * Renders the effect.
     *
     * This is an abstract method that must be overridden.
     *
     * @param renderer The renderer.
     * @param inputBuffer A frame buffer that contains the result of the previous pass.
     * @param outputBuffer A frame buffer that serves as the output render target unless this pass renders to screen.
     * @param delta The time between the last frame and the current one in seconds.
     * @param stencilTest Indicates whether a stencil mask is active.
     */
    abstract render(renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget, outputBuffer: WebGLRenderTarget, delta: number, stencilTest: boolean): void;
    /**
     * Updates this pass with the renderer's size.
     *
     * You may override this method in case you want to be informed about the size
     * of the main frame buffer.
     *
     * The {@link EffectComposer} calls this method before this pass is
     * initialized and every time its own size is updated.
     *
     * @param width - The renderer's width.
     * @param height - The renderer's height.
     * @example this.myRenderTarget.setSize(width, height);
     */
    setSize(width: number, height: number): void;
    /**
     * Performs initialization tasks.
     *
     * By overriding this method you gain access to the renderer. You'll also be
     * able to configure your custom render targets to use the appropriate format
     * (RGB or RGBA).
     *
     * The provided renderer can be used to warm up special off-screen render
     * targets by performing a preliminary render operation.
     *
     * The {@link EffectComposer} calls this method when this pass is added to its
     * queue, but not before its size has been set.
     *
     * @param renderer - The renderer.
     * @param alpha - Whether the renderer uses the alpha channel or not.
     * @example if(!alpha) { this.myRenderTarget.texture.format = RGBFormat; }
     */
    initialize(renderer: WebGLRenderer, alpha: boolean): void;
    /**
     * Performs a shallow search for disposable properties and deletes them. The
     * pass will be inoperative after this method was called!
     *
     * Disposable objects:
     *  - WebGLRenderTarget
     *  - Material
     *  - Texture
     *
     * The {@link EffectComposer} calls this method when it is being destroyed.
     * You may, however, use it independently to free memory when you are certain
     * that you don't need this pass anymore.
     */
    dispose(): void;
}
