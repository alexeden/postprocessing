type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

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
