import { merge } from 'lodash';
import { GenericObject } from '@bit/bit.envs.common.compiler-types';

export const FIXED_OUT_DIR = 'dist';
export function getTSConfig(isDev: boolean, overrideConfig: GenericObject) {
  const defaultOptions = {
    compilerOptions: {
      // the root of the capsule is CWD when transpiling and should be rootDir to adjust library sturcture.
      rootDir: './',
      outDir: FIXED_OUT_DIR,
      target: 'esnext',
      module: 'commonjs',
      moduleResolution: 'node',
      lib: ['es6'],
      allowJs: true,
      jsx: 'react',
      // Allow es6 modules and commonjs to work together.
      esModuleInterop: true,
      resolveJsonModule: true,
      experimentalDecorators: true,
      sourceMap: isDev,
      declaration: true,
      isolatedModules: true,
      allowSyntheticDefaultImports: true,
      // inline sources and source-maps so it won't clutter dist folder
      inlineSourceMap: false,
      inlineSources: isDev,
      removeComments: !isDev,
      typeRoots: [
        './node_modules/@types', // be able to consume @types.
      ],
      // bundle size in component would be better if we don't depend on tslib.
      importHelpers: false,
    },
    include: ['./**/*'],
    exclude: ['node_modules', '.dependencies', FIXED_OUT_DIR],
  };

  const config = merge({}, defaultOptions, overrideConfig);

  if (config.compilerOptions.outDir !== FIXED_OUT_DIR) {
    console.warn('Forced outDir to be: "dist".');
    config.compilerOptions.outDir = FIXED_OUT_DIR;
  }

  return config;
}
