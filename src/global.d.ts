// tslint:disable-next-line:no-empty-interface
type VertexShader = string;
// tslint:disable-next-line:no-empty-interface
type FragmentShader = string;

declare module '*.vert' {
  const vert: VertexShader;
  export default vert;
}

declare module '*.frag' {
  const frag: FragmentShader;
  export default frag;
}
