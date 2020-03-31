import { Preset } from '@bit/bit.envs.common.preset';
import { GenericObject } from '@bit/bit.envs.common.preset/dist/compiler-types';
import { getTSConfig } from './tsconfig';

const COMPILED_EXTENSIONS = ['.ts', '.tsx'];
const IGNORED_FILES = ['package.json', 'package-lock.json', 'tsconfig.json', 'stencil.config.js'];

export const stencilPreset: Preset = {
  preCompile() {
    // find default compiler options - 1 hr
    // get component structure/object in pre-compile - 1 hour
    // move component files to source - 1 hour
    // create stencil.config.js - 3 hours
    // should handle tsconfig (?) - 1 hours
    return Promise.resolve();
  },
  getDynamicConfig(rawConfig?: GenericObject) {
    const isDev = rawConfig?.development || false;

    const defaultConfig = {
      compilerPath: '@stencil/core',
      compilerArguments: rawConfig?.compilerArguments || [],
      compiledFileTypes: rawConfig?.compiledFileTypes || COMPILED_EXTENSIONS,
      configFileName: 'tsconfig.json',
      tsconfig: getTSConfig(isDev, rawConfig?.tsconfig || {}),
      development: isDev,
      copyPolicy: {
        ignorePatterns: rawConfig?.copyPolicy?.ignorePatterns || IGNORED_FILES,
        disable: false,
      },
    };

    return defaultConfig;
  },
};

// 7 hours
