import { Preset } from '@bit/bit.envs.common.preset';
import { GenericObject } from '@bit/bit.envs.common.compiler-types';
import { getTSConfig } from './tsconfig';

const COMPILED_EXTENSIONS = ['.ts', '.tsx'];
const IGNORED_FILES = ['package.json', 'package-lock.json', 'tsconfig.json'];

export const typeScriptPreset: Preset = {
  getDynamicConfig(rawConfig?: GenericObject) {
    const isDev = rawConfig?.development;

    return {
      compilerPath: 'typescript/bin/tsc',
      compilerArguments: rawConfig?.compilerArguments || ['--declaration'],
      compiledFileTypes: rawConfig?.compiledFileTypes || COMPILED_EXTENSIONS,
      configFileName: 'tsconfig.json',
      tsconfig: getTSConfig(isDev, rawConfig?.tsconfig || {}),
      development: isDev,
      copyPolicy: {
        ignorePatterns: rawConfig?.copyPolicy?.ignorePatterns || IGNORED_FILES,
        disable: false
      }
    };
  }
};
