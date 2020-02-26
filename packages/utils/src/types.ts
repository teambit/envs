import Vinyl from 'vinyl';

export interface GenericObject {
  [key: string]: any;
}

export interface IsolateOptions {
  targetDir: string;
  shouldBuildDependencies?: boolean;
  installNpmPackages?: boolean;
  keepExistingCapsule?: boolean;
}

export interface CompilerContext {
  context: GenericObject;
  configFiles: Vinyl[];
  files: Vinyl[];
  rawConfig: GenericObject;
  dynamicConfig?: GenericObject;
  api?: any;
}

export interface ActionContext {
  componentObject: any;
  rootDistDir: string;
  componentDir: string;
  isolate: () => any;
}

export interface ActionReturnType {
  dists: Vinyl[];
  mainFile?: string;
}
