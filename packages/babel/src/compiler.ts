import Vinyl from 'vinyl';

export interface GenericObject {
  [key: string]: any;
}

export interface InitAPI {
  getLogger: () => Logger;
}

export interface Logger {
  log: Function;
  error: Function;
}

export interface InitOptions {
  write: boolean;
}

export interface CompilerContext {
  context: GenericObject;
  configFiles: Vinyl[];
  files: Vinyl[];
  rawConfig: GenericObject;
  dynamicConfig?: GenericObject;
  api?: any;
}

export interface Compiler {
  init: ({ api }: { api: InitAPI }) => InitOptions;
  action: (ctx: CompilerContext) => Promise<{ dists: Vinyl[] }>;
  getDynamicPackageDependencies: (ctx: CompilerContext, name?: string) => GenericObject;
  getDynamicConfig?: (ctx: CompilerContext) => GenericObject;
  logger?: Logger;
}
