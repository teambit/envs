import { Preset } from '@bit/bit.envs.common.preset';
import { CompilationContext } from '@bit/bit.envs.common.compiler-types';

export const typeScriptPreset: Preset = {
  // getDynamicPackageDependencies() {
  //     return {
  //         dependencies: {},
  //         devDependencies: {},
  //         peerDependencies: {}
  //     };
  // },
  getDynamicConfig() {
    return {
      compilerPath: 'typescript/bin/tsc',
      compilerArguments: ['-d'],
      compiledFileTypes: ['ts', 'tsx']
    };
  }
  //async preCompile(ctx: CompilationContext) {
  //await generateTypes(ctx.directory);
  //}
};
