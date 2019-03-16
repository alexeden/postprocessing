/**
 * An enumeration of effect attributes.
 * Attributes can be concatenated using the bitwise OR operator.
 *
 * @example
 * const attributes = EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH;
 */
export declare enum EffectAttribute {
    NONE = 0,
    /** Describes effects that require a depth texture. */
    DEPTH = 1,
    /**
     * Describes effects that fetch additional samples from the input buffer.
     * There cannot be more than one effect with this attribute per {@link EffectPass}.
     */
    CONVOLUTION = 2
}
export declare enum EffectName {
    Bokeh = "BokehEffect",
    ChromaticAberration = "ChromaticAberrationEffect",
    ColorAverage = "ColorAverageEffect",
    Glitch = "GlitchEffect",
    Noise = "NoiseEffect",
    Scanline = "ScanlineEffect",
    Sepia = "SepiaEffect",
    ShockWave = "ShockWaveEffect",
    SMAA = "SMAAEffect"
}
export declare enum PassName {
    Clear = "clear",
    ClearMask = "clearMask",
    Effect = "effect",
    Mask = "mask",
    Render = "render",
    Save = "save",
    Shader = "shader"
}
/**
 * An enumeration of shader code placeholders.
 */
export declare enum Section {
    /**  A placeholder for function and variable declarations inside the fragment shader. */
    FRAGMENT_HEAD = "FRAGMENT_HEAD",
    /**  A placeholder for UV transformations inside the fragment shader. */
    FRAGMENT_MAIN_UV = "FRAGMENT_MAIN_UV",
    /**  A placeholder for color calculations inside the fragment shader. */
    FRAGMENT_MAIN_IMAGE = "FRAGMENT_MAIN_IMAGE",
    /**  A placeholder for function and variable declarations inside the vertex shader. */
    VERTEX_HEAD = "VERTEX_HEAD",
    /**  A placeholder for supporting calculations inside the vertex shader. */
    VERTEX_MAIN_SUPPORT = "VERTEX_MAIN_SUPPORT"
}
/** An enumeration of WebGL extensions. */
export declare enum WebGLExtension {
    /** Enables derivatives by adding the functions dFdx, dFdy and fwidth. */
    DERIVATIVES = "derivatives",
    /** Enables gl_FragDepthEXT to set a depth value of a fragment from within the fragment shader. */
    FRAG_DEPTH = "fragDepth",
    /** Enables multiple render targets (MRT) support. */
    DRAW_BUFFERS = "drawBuffers",
    /** Enables explicit control of texture LOD. */
    SHADER_TEXTURE_LOD = "shaderTextureLOD"
}
