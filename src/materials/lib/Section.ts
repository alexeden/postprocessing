/**
 * An enumeration of shader code placeholders.
 */
export enum Section {
  /**  A placeholder for function and variable declarations inside the fragment shader. */
  FRAGMENT_HEAD = 'FRAGMENT_HEAD',
  /**  A placeholder for UV transformations inside the fragment shader. */
  FRAGMENT_MAIN_UV = 'FRAGMENT_MAIN_UV',
  /**  A placeholder for color calculations inside the fragment shader. */
  FRAGMENT_MAIN_IMAGE = 'FRAGMENT_MAIN_IMAGE',
  /**  A placeholder for function and variable declarations inside the vertex shader. */
  VERTEX_HEAD = 'VERTEX_HEAD',
  /**  A placeholder for supporting calculations inside the vertex shader. */
  VERTEX_MAIN_SUPPORT = 'VERTEX_MAIN_SUPPORT',
}
