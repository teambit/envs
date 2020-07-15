import Vinyl from 'vinyl';
import * as path from 'path';
import { promises as fsp } from 'fs';
import execa from 'execa';

import {
  CompilerContext,
  BuildResults,
  createCapsule,
  destroyCapsule,
  readFiles,
  createTS,
  getSourceFiles,
  //moveFiles,
} from '@bit/bit.envs.compilers.utils';

import { TSConfig } from './tsconfig';
import { moveFiles } from './move-files';
import { logger } from './logger';

const DEV_DEPS = {};

export function getDynamicPackageDependencies(): Record<string, any> {
  return {
    devDependencies: DEV_DEPS,
  };
}

export function getDynamicConfig(ctx: CompilerContext): Record<string, any> {
  return ctx.rawConfig;
}

export async function action(ctx: CompilerContext): Promise<BuildResults> {
  // build capsule
  const { rootDir, distDir, component, capsule } = await createCapsule(ctx.context.isolate, {
    shouldBuildDependencies: true,
  });
  let { files } = component;
  //@ts-ignore
  const { name, mainFile } = component;
  logger(`Building capsule in ${rootDir}`);

  // Moving the files to src directory to avoid weird collisions
  files = await moveFiles(rootDir, files);

  // create tsconfig.json
  await createTS(rootDir, TSConfig, ctx.rawConfig.tsconfig, {
    include: getSourceFiles(files, []).map((s: Vinyl): string => s.path),
  });

  const stencilConfigPath = path.resolve(rootDir, 'stencil.config.ts');
  const stencilConfig = {
    namespace: name,
    hashFileNames: false,
    outputTargets: [
      {
        type: 'dist',
        esmLoaderPath: 'loader',
      },
    ],
  };

  // write stencil config
  const stencilConfigContents = `import { Config } from '@stencil/core';  export const config  =`;
  await fsp.writeFile(stencilConfigPath, `${stencilConfigContents} ${JSON.stringify(stencilConfig, null, 4)}`);

  try {
    const compiler = require.resolve('@stencil/core/bin/stencil');
    //@ts-ignore
    const results = await execa(compiler, ['build', '--log'], { cwd: rootDir });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  // get dists and main file
  const dists = await readFiles(distDir);
  destroyCapsule(capsule);
  return {
    mainFile: `index.js`,
    dists: dists || [],
    packageJson: {
      module: 'dist/index.mjs',
      collection: 'dist/collection/collection-manifest.json',
      types: 'dist/types/components.d.ts',
    },
  };
}
