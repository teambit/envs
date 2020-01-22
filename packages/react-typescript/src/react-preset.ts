import { CompilationContext, GenericObject } from '@bit/bit.envs.common.compiler-types';
import { Preset } from '@bit/bit.envs.common.preset';
import { generateTypes } from './generate-types';
import { getTSConfig } from './tsconfig';

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
  getDynamicConfig(rawConfig?: GenericObject) {
    const configUserOverrides = rawConfig?.tsconfig ? rawConfig.tsconfig : {};
    const isDev = rawConfig?.development ? rawConfig.development : false;
    const compilerArguments = rawConfig?.compilerArguments ? rawConfig.compilerArguments : ['-d'];
    const compiledFileTypes = rawConfig?.compiledFileTypes ? rawConfig.compiledFileTypes : ['.ts', '.tsx'];
    const copyPolicyIgnorePatterns = rawConfig?.copyPolicy?.ignorePatterns
      ? rawConfig.copyPolicy.ignorePatterns
      : ['package.json', 'package-lock.json', 'tsconfig.json'];

    const defaultConfig = {
      compilerPath: 'typescript/bin/tsc',
      compilerArguments,
      compiledFileTypes,
      configFileName: 'tsconfig.json',
      tsconfig: getTSConfig(isDev, configUserOverrides),
      development: isDev,
      copyPolicy: {
        ignorePatterns: copyPolicyIgnorePatterns,
        disable: false
      },
      useExperimentalCache: false
    };

    return defaultConfig;
  },
  async preCompile(ctx: CompilationContext) {
    await generateTypes(ctx.directory);
  }
};
