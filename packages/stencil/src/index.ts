import * as path from 'path';
import debug from 'debug';
import * as fs from 'fs-extra';

import { compile } from '@stencil/core/compiler/stencil.js';

(async function() {
  const filePath = path.join(
    process.cwd(),
    '../workspace/components/my-component/components/my-component/my-component.tsx'
  );
  console.log(filePath);
})();

import {
  CompilerContext,
  ActionReturnType,
  createCapsule,
  destroyCapsule,
  readFiles
} from '@bit/bit.envs.common.utils';

if (process.env.DEBUG) {
  debug('build');
}

export function getDynamicPackageDependencies() {
  return {};
}

export function getDynamicConfig(ctx: CompilerContext) {
  return ctx.rawConfig;
}

export async function action(ctx: CompilerContext): Promise<ActionReturnType> {
  const { context } = ctx;
  const { componentObject, isolate } = context;

  // build capsule
  const { res, directory } = await createCapsule(isolate, { shouldBuildDependencies: true });
  const distDir = path.join(directory, 'dist');

  try {
    const source = await fs.readFile(path.join(directory, componentObject.mainFile));
    let res = await compile(source.toString());
    await fs.ensureDir(distDir);
    await fs.writeFile(path.join(distDir, 'comp.js'), res.code);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  //get dists and main file
  const dists = await readFiles(distDir);
  destroyCapsule(res.capsule);
  return {
    mainFile: `${componentObject.name}.common.js`,
    dists: dists || []
  };
}
