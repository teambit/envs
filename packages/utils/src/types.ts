import Vinyl from 'vinyl';

export interface IsolateOptions {
  targetDir: string;
  shouldBuildDependencies?: boolean;
  installNpmPackages?: boolean;
  keepExistingCapsule?: boolean;
}

export interface CompilerContext {
  context: Record<string, any>;
  configFiles: Vinyl[];
  files: Vinyl[];
  rawConfig: Record<string, any>;
  dynamicConfig?: Record<string, any>;
  api?: any;
}

export interface ActionContext {
  componentObject: any;
  rootDistDir: string;
  componentDir: string;
  isolate: () => any;
}

export interface BuildResults {
  dists: Vinyl[];
  mainFile?: string;
  packageJson?: Record<string, any>;
}
