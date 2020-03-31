import { Preset } from '@bit/bit.envs.common.preset';
import { GenericObject, CompilationContext } from '@bit/bit.envs.common.preset/dist/compiler-types';
import { getTSConfig } from './tsconfig';
import { promises as fs } from 'fs-extra';
import { join } from 'path';
const COMPILED_EXTENSIONS = ['.ts', '.tsx'];
const IGNORED_FILES = ['package.json', 'package-lock.json', 'tsconfig.json', 'stencil.config.js'];

export const stencilPreset: Preset = {
  getDynamicPackageDependencies() {
    return {
      dependencies: {},
      devDependencies: {},
      peerDependencies: {
        '@stencil/core': '^1.11.3',
      },
    };
  },
  async preCompile(ctx) {
    // await moveComponentToSRCInCapsule(ctx);
    await createStencilConfig(ctx);
  },
  getDynamicConfig(rawConfig?: GenericObject) {
    const isDev = rawConfig?.development || false;

    const defaultConfig = {
      compilerPath: '@stencil/core/bin/stencil',
      compilerArguments: rawConfig?.compilerArguments || ['build'],
      compiledFileTypes: rawConfig?.compiledFileTypes || COMPILED_EXTENSIONS,
      configFileName: 'tsconfig.json',
      tsconfig: getTSConfig(isDev, rawConfig?.tsconfig || {}),
      development: isDev,
      copyPolicy: {
        ignorePatterns: rawConfig?.copyPolicy?.ignorePatterns || IGNORED_FILES,
        disable: false,
      },
    };
    ``;
    return defaultConfig;
  },
  enrichResult(value: GenericObject, _info: CompilationContext) {
    // add package.json keys 1 hour
    return Promise.resolve(value);
  },
};

export async function createStencilConfig(ctx: CompilationContext) {
  // configure this object to change stencil configuration
  const config = {
    namespace: ctx.name,
    outputTargets: [
      {
        type: 'dist',
      },
    ],
  };

  const configString = `
  import { Config } from '@stencil/core';
  export const config: Config = ${JSON.stringify(config, null, 2)}   
  `;
  const configPath = join(ctx.directory, 'stencil.config.ts');
  await fs.writeFile(configPath, configString, 'utf8');
}

// export async function moveComponentToSRCInCapsule(_ctx: CompilationContext) {
//   // I might need to put all component files in src folder. - 2 hours
//   return Promise.resolve();
// }
