// implicit dependencies made explicit
import '@angular/compiler';
import '@angular/compiler-cli';
import '@angular/core';
import 'ng-packagr';
import 'typescript';
import 'tslib';
import 'tsickle';

import path from 'path';
import execa from 'execa';
import readdir from 'recursive-readdir';
import Vinyl from 'vinyl';
import { promises as fs, existsSync } from 'fs';

const os = require('os');
const tsconfig = require(path.join(__dirname, './tsconfig.json'));

const FILE_NAME = 'public_api';
const DEBUG_FLAG = 'NG_DEBUG';

function print(msg) {
  process.env[DEBUG_FLAG] && console.log(msg);
}

const compile = async (_files, distPath, api) => {
  const { res, directory } = await isolate(api); // create capsule
  const context = await createContext(res, directory, distPath); // prepare context object

  if (!~context.dependencies.indexOf('@angular/core')) {
    await res.installPackages(['@angular/core', 'rxjs', 'zone.js']);
  }

  await adjustFileSystem(context);
  const results = await _compile(context);
  if (!process.env[DEBUG_FLAG]) {
    await context.capsule.destroy();
  }

  return results;
};

async function _compile(context) {
  await runNGPackagr(context);
  const dists = await collectDistFiles(context);
  const packageJson: any = getPackageJsonObject(dists, context.name);
  const { main } = packageJson;
  delete packageJson.main;
  print('main is: ' + main);
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

async function isolate(api) {
  const uuidHack = `capsule-${Date.now()
    .toString()
    .slice(-5)}`;
  const targetDir = path.join(os.tmpdir(), 'bit', uuidHack);
  const componentName = api.componentObject.name;
  print(`\n building ${componentName} on directory ${targetDir}`);

  const res = await api.isolate({ targetDir, shouldBuildDependencies: true });

  return { res, directory: targetDir };
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

async function adjustFileSystem(context) {
  const ngPackge = await createPackagrFile(context);
  await createPublicAPIFile(context);
  await createTSConfig(context);
  return ngPackge;
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

function createTSConfig(context) {
  const pathToConfig = getTSConfigPath(context);
  const content = tsconfig;
  return fs.writeFile(pathToConfig, JSON.stringify(content, null, 4));
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

export default { compile };
