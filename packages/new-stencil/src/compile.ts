import { TypescriptCompiler } from '@bit/bit.envs.compilers.typescript';
import { stencilPreset } from './preset';

export function createStencilCompiler() {
  return new TypescriptCompiler(stencilPreset);
}
