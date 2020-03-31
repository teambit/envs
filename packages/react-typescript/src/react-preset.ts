import { CompilationContext, GenericObject } from '@bit/bit.envs.common.compiler-types';
import { Preset } from '@bit/bit.envs.common.preset';
import { generateTypes } from './generate-types';
import { getTSConfig } from './tsconfig';

const COMPILED_EXTENSIONS = ['.ts', '.tsx'];
const IGNORED_FILES = ['package.json', 'package-lock.json', 'tsconfig.json'];

export const reactPreset: Preset = {
  getDynamicPackageDependencies() {
    return {
      dependencies: {},
      devDependencies: {},
      peerDependencies: {
        react: '^16.11.0',
        'react-dom': '^16.11.0',
        '@types/react': '16.9.11',
        '@types/react-dom': '16.9.4',
      },
    };
  },
  getDynamicConfig(rawConfig?: GenericObject) {
    const config = {
      compilerArguments: ['--declaration'],
      compiledFileTypes: COMPILED_EXTENSIONS,
      configFileName: 'tsconfig.json',
      tsconfig: {},
      development: false,
      copyPolicy: {},
      ...(rawConfig || {}),
    };
    const isDev = config.development;

    const defaultConfig = {
      compilerPath: 'typescript/bin/tsc',
      compilerArguments: config.compilerArguments,
      compiledFileTypes: config.compiledFileTypes,
      configFileName: 'tsconfig.json',
      tsconfig: getTSConfig(isDev, config.tsconfig),
      development: isDev,
      copyPolicy: {
        ignorePatterns: (config.copyPolicy as any).ignorePatterns || IGNORED_FILES,
        disable: false,
      },
    };

    return defaultConfig;
  },
  async preCompile(ctx: CompilationContext) {
    await generateTypes(ctx.directory);
  },
};
