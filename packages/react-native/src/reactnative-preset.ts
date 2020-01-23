import { merge, has } from 'lodash';
import { Preset } from '@bit/bit.envs.common.preset';
import { GenericObject, CompilerContext } from '@bit/bit.envs.common.compiler-types';
import { getBabelrc, FIXED_OUT_DIR } from './babelrc';
import { getPackageDependencies, getDependencieVersion } from './dependencies-helpers';
import { babelPrefixResolve } from './babel-prefix-resolve';

export const reactNativePreset: Preset = {
  getDynamicPackageDependencies(ctx?: CompilerContext) {
    const deps = {
      dependencies: {},
      devDependencies: {
        'metro-react-native-babel-preset': '^0.57.0'
      },
      peerDependencies: {
        react: '^16.9.0',
        'react-native': '^0.61.5'
      }
    };

    const packageDeps = getPackageDependencies(
      `${ctx?.context.componentDir ? ctx.context.componentDir : ctx?.context.workspaceDir}/package.json`
    );

    const babelDependencies = (type: string, prefixType: string) => {
      const babelDeps: GenericObject = {};
      ctx?.rawConfig.babel[type].map((_dep: string) => {
        const dep = babelPrefixResolve(_dep, prefixType);
        babelDeps[dep] = getDependencieVersion(packageDeps, dep, prefixType);
      });
      deps.devDependencies = merge(deps.devDependencies, babelDeps);
    };

    if (has(ctx, 'rawConfig.babel.plugins')) babelDependencies('plugins', 'plugin');

    if (has(ctx, 'rawConfig.babel.presets')) babelDependencies('presets', 'preset');

    return deps;
  },
  getDynamicConfig(rawConfig?: GenericObject) {
    const configUserOverrides = rawConfig?.babel ? rawConfig.babel : {};
    const isDev = rawConfig?.development ? rawConfig.development : false;
    const compilerArguments = rawConfig?.compilerArguments
      ? rawConfig.compilerArguments
      : ['./**/*', '--ignore', `node_modules,.dependencies,${FIXED_OUT_DIR}`, '-d', FIXED_OUT_DIR];
    const compiledFileTypes = rawConfig?.compiledFileTypes ? rawConfig.compiledFileTypes : ['.js'];
    const copyPolicyIgnorePatterns = rawConfig?.copyPolicy?.ignorePatterns
      ? rawConfig.copyPolicy.ignorePatterns
      : ['package.json', 'package-lock.json', '.babelrc', 'babel.config.js'];

    const defaultConfig = {
      compilerPath: '@babel/cli/bin/babel',
      compilerArguments,
      compiledFileTypes,
      configFileName: 'babel.config.json',
      babel: getBabelrc(isDev, configUserOverrides),
      development: isDev,
      copyPolicy: {
        ignorePatterns: copyPolicyIgnorePatterns,
        disable: false
      },
      useExperimentalCache: false
    };

    return defaultConfig;
  }
};
