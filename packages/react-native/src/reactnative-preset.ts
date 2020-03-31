import { merge, has } from 'lodash';
import { Preset } from '@bit/bit.envs.common.preset';
import { GenericObject, CompilerContext } from '@bit/bit.envs.common.compiler-types';
import { getBabelrc, FIXED_OUT_DIR } from './babelrc';
import { getPackageDependencies, getDependencieVersion } from './dependencies-helpers';
import { babelPrefixResolve } from './babel-prefix-resolve';

const COMPILED_EXTENSIONS = ['.js'];
const IGNORED_FILES = ['package.json', 'package-lock.json', '.babelrc', 'babel.config.js'];
const COMPILER_ARGUMENTS = ['./**/*', '--ignore', `node_modules,.dependencies,${FIXED_OUT_DIR}`, '-d', FIXED_OUT_DIR];

export const reactNativePreset: Preset = {
  getDynamicPackageDependencies(ctx?: CompilerContext) {
    const deps = {
      dependencies: {},
      devDependencies: {
        'metro-react-native-babel-preset': '^0.57.0',
      },
      peerDependencies: {
        react: '^16.9.0',
        'react-native': '^0.61.5',
      },
    };

    const packageDeps = getPackageDependencies(
      `${ctx && ctx.context.componentDir ? ctx.context.componentDir : ctx ? ctx.context.workspaceDir : ''}/package.json`
    );

    const babelDependencies = (type: string, prefixType: string) => {
      const babelDeps: GenericObject = {};
      ctx!.rawConfig.babel[type].map((_dep: string) => {
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
    const config = {
      compilerArguments: COMPILER_ARGUMENTS,
      compiledFileTypes: COMPILED_EXTENSIONS,
      babel: {},
      development: false,
      copyPolicy: {},
      ...(rawConfig || {}),
    };
    const isDev = config.development;

    const defaultConfig = {
      compilerPath: '@babel/cli/bin/babel',
      compilerArguments: config.compilerArguments,
      compiledFileTypes: config.compilerArguments,
      configFileName: 'babel.config.json',
      babel: getBabelrc(isDev, config.babel),
      development: isDev,
      copyPolicy: {
        ignorePatterns: rawConfig!.copyPolicy!.ignorePatterns || IGNORED_FILES,
        disable: false,
      },
      useExperimentalCache: false,
    };

    return defaultConfig;
  },
};
