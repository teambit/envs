import { CompilerContext, Compiler } from '@bit/bit.envs.common.compiler-types';

export interface TesterReturnType {}

export interface TesterContext extends CompilerContext {}

export interface Tester extends Compiler {
  action: (ctx: TesterContext) => Promise<TesterReturnType>;
}
