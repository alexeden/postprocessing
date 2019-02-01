declare module 'shader-types' {
  export type VertexShader = string;
  export type FragmentShader = string;
}

declare module '*.vert' {
  export type VertexShader = string;
  const vert: VertexShader;
  export default vert;
}

declare module '*.frag' {
  export type FragmentShader = string;
  const frag: FragmentShader;
  export default frag;
}
