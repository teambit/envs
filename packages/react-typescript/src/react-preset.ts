import { CompilationContext } from '@bit/bit.envs.common.compiler-types';
import { Preset } from '@bit/bit.envs.common.preset';

import { generateTypes } from './generate-types';

export const reactPreset: Preset = {
  getDynamicPackageDependencies() {
    return {
      dependencies: {},
      devDependencies: {},
      peerDependencies: {
        react: '^16.11.0',
        'react-dom': '^16.11.0',
        '@types/react': '16.9.11',
        '@types/react-dom': '16.9.4'
      }
    };
  },
  getDynamicConfig() {
    return {
      tsconfig: {
        compilerOptions: {
          lib: ['dom', 'es2015'],
          jsx: 'react'
        },
        include: ['./**/*']
      }
    };
  },
  async preCompile(ctx: CompilationContext) {
    await generateTypes(ctx.directory);
  }
};
