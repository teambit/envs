// implicit dependencies made explicit
// import '@angular/compiler';
// import '@angular/compiler-cli';
// import '@angular/core';
// import '@angular/bazel';
// import '@bazel/typescript';
// import 'ng-packagr';
// import 'typescript';
// import 'tslib';
// import 'tsickle';

import path from 'path';
import debug from 'debug';
import execa from 'execa';

import readdir from 'recursive-readdir';
import Vinyl from 'vinyl';
import { promises as fs, existsSync } from 'fs';

import { TSConfig } from './tsconfig';

import {
  CompilerContext,
  BuildResults,
  createCapsule,
  destroyCapsule,
  getSourceFiles,
  readFiles
} from '@bit/bit.envs.compilers.utils';

if (process.env.DEBUG) {
  debug('build');
}

const FILE_NAME = 'public_api';

export async function action(ctx: CompilerContext): Promise<BuildResults> {
  const { context, files } = ctx;
  const { componentObject, isolate } = context;

  // build capsule
  const { res, directory } = await createCapsule(isolate, { shouldBuildDependencies: true });
  const distDir = path.join(directory, 'dist');

  // const { res, directory } = await isolate(api); // create capsule
  // const context = await createContext(res, directory, distPath); // prepare context object

  if (!~context.dependencies.indexOf('@angular/core')) {
    await res.installPackages(['@angular/core', 'rxjs', 'zone.js']);
  }

  const ngPackge = await createPackagrFile(context);

  await createPublicAPIFile(context);

  // create tsconfig.json
  let sources: Array<Vinyl> = getSourceFiles(files, ['ts']);
  let TS = Object.assign(TSConfig, {
    include: sources.map(s => s.path)
  });
  await fs.writeFile(path.join(directory, 'tsconfig.json'), JSON.stringify(TS, null, 4));

  await runNGPackagr(context);

  //get dists
  const dists = await readFiles(distDir);
  console.log(dists);

  const packageJson: any = getPackageJsonObject(dists, context.name);
  const { main } = packageJson;
  delete packageJson.main;
  debug('main is: ' + main);
  destroyCapsule(res.capsule);

  return { mainFile: main, dists, packageJson };
}

async function createContext(res, directory, distPath) {
  const componentObject = res.componentWithDependencies.component.toObject();
  return {
    main: componentObject.mainFile,
    dist: distPath,
    name: componentObject.name,
    dependencies: getCustomDependencies(directory),
    capsule: res.capsule,
    directory
  };
}

async function collectDistFiles(context) {
  const capsuleDir = context.directory;
  const compDistDir = path.resolve(capsuleDir, 'dist');
  const files = await readdir(compDistDir);
  const readFiles = await Promise.all(
    files.map(file => {
      return fs.readFile(file);
    })
  );
  return files.map((file, index) => {
    return new Vinyl({
      path: path.join(context.name, file.split(path.join(capsuleDir, 'dist'))[1]),
      contents: readFiles[index]
    });
  });
}

async function runNGPackagr(context) {
  let result = null;
  const scriptFile = path.resolve(require.resolve('ng-packagr/cli/main'));
  const cwd = process.cwd();
  try {
    process.chdir(context.directory);
    result = await execa(`node`, [scriptFile, `-p`, `ng-package.json`, `-c`, `tsconfig.json`]);
  } catch (e) {
    process.chdir(cwd);
    throw e;
  }
  process.chdir(cwd);
  return result;
}

async function createPackagrFile(context) {
  const compDir = context.directory;
  const content = `{
        "$schema": "https://raw.githubusercontent.com/ng-packagr/ng-packagr/master/src/ng-package.schema.json",
        "dest": "dist",
        "lib": {
            "entryFile": "${FILE_NAME}"
        },
        "whitelistedNonPeerDependencies":[${context.dependencies.map(val => `"${val}"`).concat([`"@angular/core"`])}]
    }`;
  const filePath = path.resolve(path.join(compDir, 'ng-package.json'));
  await fs.writeFile(filePath, content);
  return filePath;
}

function getTSConfigPath(context) {
  return path.join(context.directory, 'tsconfig.json');
}

function getPackageJsonObject(dists, name) {
  const pkgJsonRaw = dists.find(function(e) {
    return e.basename === 'package.json';
  });
  const pkgJson = JSON.parse(pkgJsonRaw.contents.toString());
  const keysToTransform = ['es2015', 'esm5', 'esm2015', 'fesm5', 'fesm2015', 'main', 'module', 'typings'];

  return keysToTransform.reduce((acc, key) => {
    // Special case for main to remove the dist, since bit will add it himself
    if (key === 'main') {
      acc[key] = pkgJson[key].startsWith('dist') ? pkgJson[key].replace(/^dist/g, name) : path.join(name, pkgJson[key]);
    } else {
      acc[key] = pkgJson[key].startsWith('dist')
        ? pkgJson[key].replace(/^dist/g, path.join('dist', name))
        : path.join('dist', name, pkgJson[key]);
    }
    return acc;
  }, {});
}

function createPublicAPIFile(context) {
  debugger;
  const pathToPublicAPI = path.resolve(context.directory, FILE_NAME);
  if (existsSync(`${pathToPublicAPI}.ts`)) {
    return;
  }
  const relativePathContent = path.relative(
    context.directory,
    path.join(context.directory, context.main.split('.ts')[0])
  );
  const content = `export * from './${relativePathContent}'`;
  return fs.writeFile(`${pathToPublicAPI}.ts`, content);
}

function getCustomDependencies(dir) {
  return Object.keys(require(`${dir}/package.json`).dependencies || {});
}
