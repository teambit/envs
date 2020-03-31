import { CompilationContext, GenericObject, CompilerContext } from './compiler-types';

export interface CopyPolicy {
  ignorePatterns: string[];
  disable: boolean;
}

export interface GenericStringObject {
  [k: string]: string;
}

export interface DependenciesJSON {
  dependencies?: GenericStringObject;
  devDependencies?: GenericStringObject;
  peerDependencies?: GenericStringObject;
}

export interface Preset {
  getDynamicPackageDependencies?(ctx?: CompilerContext): DependenciesJSON;
  getDynamicConfig?(rawConfig?: GenericObject): GenericObject;
  runCompiler?(): Promise<void>;
  preCompile?(ctx: CompilationContext): Promise<void>;
  enrichResult?(value: GenericObject, info: CompilationContext): Promise<GenericObject>;
}
