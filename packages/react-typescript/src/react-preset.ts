import { CompilationContext } from '@bit/bit.envs.common.compiler-types';
import { getCustomTypes } from './custom-types';
import path from 'path';
import fs from 'fs-extra';
import 'mocha';

export const reactPreset = {
  getDynamicPackageDependencies() {
    debugger;
    return {
      dependencies: {
        '@types/react': '16.9.11',
        '@types/react-dom': '16.9.4'
      },
      devDependencies: {},
      peerDependencies: {
        react: '^16.11.0',
        'react-dom': '^16.11.0'
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
  preCompile(ctx: CompilationContext) {
    return generateTypes(ctx);
  }
};

export function generateTypes(ctx: CompilationContext) {
  const typesPath = path.join(ctx.directory, 'bit_types.d.ts');
  const content = getCustomTypes();
  return fs.writeFile(typesPath, content);
}
