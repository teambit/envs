import { Preset } from '@bit/bit.envs.common.preset';
import { GenericObject } from '@bit/bit.envs.common.compiler-types';
import { getTSConfig } from './tsconfig';

export const typeScriptPreset: Preset = {
  //@ts-ignore
  getDynamicConfig(rawConfig?: GenericObject) {
    const configUserOverrides = rawConfig?.tsconfig ? rawConfig.tsconfig : {};
    const isDev = rawConfig?.development ? rawConfig.development : false;

    const defaultConfig = {
      compilerPath: 'typescript/bin/tsc',
      compilerArguments: ['-d'],
      compiledFileTypes: ['ts', 'tsx'],
      configFileName: 'tsconfig.json',
      tsconfig: getTSConfig(isDev, configUserOverrides),
      development: isDev,
      copyPolicy: {
        ignorePatterns: ['package.json', 'package-lock.json', 'tsconfig.json'],
        disable: false
      },
      useExperimentalCache: false
    };

    return defaultConfig;
  }
};
