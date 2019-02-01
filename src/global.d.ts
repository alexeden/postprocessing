declare module '*.vert' {
  // tslint:disable-next-line:no-empty-interface
  export interface VertexShader extends string { }
  const vert: VertexShader;
  export default vert;
}

declare module '*.frag' {
  // tslint:disable-next-line:no-empty-interface
  export interface FragmentShader extends string { }
  const frag: FragmentShader;
  export default frag;
}
