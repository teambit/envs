//implicit dependencies made explicit
import '@angular/compiler';
import '@angular/compiler-cli';
import '@angular/core';
import '@bazel/typescript';
import 'typescript';
import 'tslib';
import 'tsickle';
import 'rxjs';

import * as ngPackagr from 'ng-packagr';
import path from 'path';
import debug from 'debug';
import Vinyl from 'vinyl';
import * as fs from 'fs';

import { TSConfig } from './tsconfig';

import {
  BuildResults,
  CompilerContext,
  createCapsule,
  destroyCapsule,
  getTestFiles,
  readFiles,
} from '@bit/bit.envs.compilers.utils';

if (process.env.DEBUG) {
  debug('build');
}

const DEV_DEPS = {
  tslib: '>=2.1.0',
  'webpack-env': '>=0.8.0',
  '@angular/core': '>= 11.0.8',
  '@angular/common': '>= 11.0.8',
};

const PKG_JSON_KEYS = [
  'es2015_ivy_ngcc',
  'es2015',
  'esm5',
  'esm2015',
  'fesm5',
  'fesm2015_ivy_ngcc',
  'fesm2015',
  'module',
  'typings',
  'metadata',
];

const DIST_DIRECTORY = 'dist';

export function getDynamicPackageDependencies(): Record<string, any> {
  return {
    devDependencies: DEV_DEPS,
  };
}

function escapeRegExp(input: string): string {
  return input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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
  await fs.writeFileSync(TSFile, JSON.stringify(TS, null, 4));

  //create ng-package.json
  const ngPackageFile = path.resolve(directory, 'ng-package.json');
  const ngPackage = {
    dest: 'dist',
    lib: {
      entryFile: mainFile,
    },
    whitelistedNonPeerDependencies: [
      ...Object.keys(DEV_DEPS).map(escapeRegExp),
      ...Object.keys(componentObject.packageDependencies).map(escapeRegExp),
      escapeRegExp('@bit'), // ...bitDependencies
    ],
  };
  if (!fs.existsSync(ngPackageFile)) {
    fs.writeFileSync(ngPackageFile, JSON.stringify(ngPackage, null, 4));
  }

  await ngPackagr
    .ngPackagr()
    .forProject(ngPackageFile)
    .withTsConfig(TSFile)
    .build()
    .catch((e: Error): void => {
      console.error(e);
      throw e;
    });

  //get dists
  const dists = (await readFiles(distDir)) || [];

  //update keys from package.json
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgJsonContent = require(path.resolve(distDir, 'package.json'));
  const packageJson: Record<string, any> = {};
  PKG_JSON_KEYS.forEach((k: string): void => {
    if (k in pkgJsonContent) {
      packageJson[k] = path.join(DIST_DIRECTORY, pkgJsonContent[k]);
    }
  });
  destroyCapsule(res.capsule);

  return {
    mainFile: pkgJsonContent.main,
    dists,
    packageJson,
  };
}
