// tslint:disable-next-line:no-empty-interface
interface VertexShader extends string { }
// tslint:disable-next-line:no-empty-interface
interface FragmentShader extends string { }

declare module '*.vert' {
  const vert: VertexShader;
  export default vert;
}

declare module '*.frag' {
  const frag: FragmentShader;
  export default frag;
}
