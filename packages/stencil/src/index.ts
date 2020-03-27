import Vinyl from 'vinyl';
import * as path from 'path';
import debug from 'debug';
import { promises as fsp } from 'fs';

import { compile } from '@stencil/core/compiler/stencil.js';

import { TSConfig } from './tsconfig';

import {
  CompilerContext,
  BuildResults,
  createCapsule,
  destroyCapsule,
  readFiles,
  getTestFiles,
  getSourceFiles,
} from '@bit/bit.envs.compilers.utils';

if (process.env.DEBUG) {
  debug('build');
}

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
  const { res, directory } = await createCapsule(ctx.context.isolate, { shouldBuildDependencies: true });
  const distDir = path.join(directory, 'dist');

  const componentObject = res.componentWithDependencies.component.toObject();
  const { files, mainFile } = componentObject;

  debug(`Building capsule in ${directory}`);

  // create tsconfig.json
  let tests: Vinyl[] = getTestFiles(files, []);
  let TS = Object.assign(TSConfig, {
    exclude: [...TSConfig.exclude, ...tests.map((s: Vinyl): string => s.path)],
  });

  const TSFile = path.resolve(directory, 'tsconfig.json');
  await fsp.writeFile(TSFile, JSON.stringify(TS, null, 4));
  try {
    console.log('MAIN', mainFile);
    console.log('DIST', distDir);
    console.log('FILES', files);
    files.forEach((f) => console.log(f.basename));
    const main = files.find((f: Vinyl): boolean => f.path === mainFile);
    let res = await compile(main.contents.toString(), { module: 'cjs' });
    console.log('RES', res);
    await fsp.mkdir(distDir);
    await fsp.writeFile(path.resolve(distDir, `${main.stem}.js`), res.code);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  //get dists and main file
  const dists = await readFiles(distDir);
  destroyCapsule(res.capsule);
  return {
    mainFile: `${componentObject.name}.common.js`,
    dists: dists || [],
  };
}
