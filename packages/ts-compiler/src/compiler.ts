import Vinyl from 'vinyl'

export type GenericObject = { [key: string]: any };

export interface InitAPI {
  getLogger: () => Logger
}

export interface Logger {
  log: Function
  error: Function
}

export interface InitOptions {
  write: boolean
}

export interface CompilerContext {
  context: GenericObject
  configFiles: Array<Vinyl>
  files: Array<Vinyl>
  rawConfig: GenericObject
  dynamicConfig?: GenericObject
  api?: any
}
export interface ActionReturnType { dists: Vinyl[], mainFile: string }

export interface Compiler {
  init: ({ api }: { api: InitAPI }) => InitOptions
  action: (ctx: CompilerContext) => Promise<ActionReturnType>
  getDynamicPackageDependencies: (ctx: CompilerContext, name?: string ) => GenericObject
  getDynamicConfig?: (ctx: CompilerContext) => GenericObject
  logger?: Logger
}
