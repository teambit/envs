import { CompilationContext, GenericObject } from './compiler-types';

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
  getDynamicPackageDependencies?(): DependenciesJSON;
  getDynamicConfig?(): GenericObject;
  runCompiler?(): Promise<void>;
  preCompile?(ctx: CompilationContext): Promise<void>;
}
