import { Preset } from '@bit/bit.envs.common.preset';
import { GenericObject } from '@bit/bit.envs.common.compiler-types';
import { getTSConfig } from './tsconfig';

const COMPILED_EXTENSIONS = ['.ts', '.tsx'];
const IGNORED_FILES = ['package.json', 'package-lock.json', 'tsconfig.json'];

export const typeScriptPreset: Preset = {
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
    return {
      compilerPath: 'typescript/bin/tsc',
      compilerArguments: config.compilerArguments,
      compiledFileTypes: config.compiledFileTypes,
      configFileName: 'tsconfig.json',
      tsconfig: getTSConfig(isDev, config.tsconfig),
      development: isDev,
      copyPolicy: {
        ignorePatterns: (config.copyPolicy as any).ignorePatterns! || IGNORED_FILES,
        disable: false,
      },
    };
  },
};
