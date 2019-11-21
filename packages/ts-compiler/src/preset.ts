import { GenericObject } from './compiler';
import { getCustomTypes } from './custom-types';
import { CompilationContext } from './compiler';
import path from 'path';
import fs from 'fs-extra';
export interface GenericStringObject {
  [k: string]: string;
}

export interface DependenciesJSON {
  dependencies?: GenericStringObject;
  devDependencies?: GenericStringObject;
  peerDependencies?: GenericStringObject;
}

export interface CopyPolicy {
  ignorePatterns: string[];
  disable: boolean;
}

export interface Preset {
  getDynamicPackageDependencies?(): DependenciesJSON;
  getDynamicConfig?(): GenericObject;
  runCompiler?(): Promise<void>;
  preCompile?(ctx: CompilationContext): Promise<void>;
}

export const presetStore: { [k: string]: Preset } = {
  REACT: {
    getDynamicPackageDependencies() {
      return {
        devDependencies: {
          '@types/react': '16.9.11',
          '@types/react-dom': '16.9.4'
        },
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
  },
  NONE: {}
};

export function generateTypes(ctx: CompilationContext) {
  const typesPath = path.join(ctx.directory, 'bit_types.d.ts');
  const content = getCustomTypes();
  return fs.writeFile(typesPath, content);
}
