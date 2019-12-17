import execa from 'execa';
import { Stats } from 'fs';
import * as fs from 'fs-extra';
import path, { relative, sep } from 'path';
import readdir from 'recursive-readdir';
import Vinyl from 'vinyl';
import { CompilerContext, GenericObject, CompilationContext } from '@bit/bit.envs.common.compiler-types';
import { FIXED_OUT_DIR } from './tsconfig';
import 'typescript';

import { CopyPolicy, Preset } from '@bit/bit.envs.common.preset';

import { getTSConfig } from './tsconfig';
import { isolate, DEBUG_FLAG } from '@bit/bit.envs.common.isolate';
import md5 from 'md5';
import os from 'os';

export async function compile(cc: CompilerContext, preset: Preset) {
  let isolateResult = null;
  if (!cc.dynamicConfig!.useExperimentalCache) {
    isolateResult = await isolate(cc);
  } else {
    const name = getCapsuleName(cc);
    isolateResult = await isolate(
      cc,
      {
        skipNodeModules: true,
        keepExistingCapsule: true
      },
      name
    );
  }
  const { res, directory } = isolateResult;
  const srcTestFiles = getSrcTestFiles(cc.files);
  const context = await createContext(res, directory, cc, srcTestFiles);
  let results = null;
  await preCompile(context, preset);
  if (getNonCompiledFiles(cc.files).length === cc.files.length) {
    const dists = await collectNonDistFiles(context);
    results = { dists };
  } else {
    results = await _compile(context, cc);
  }

  if (!process.env[DEBUG_FLAG] && !cc.dynamicConfig!.useExperimentalCache) {
    await context.capsule.destroy();
  }
  return results;
}

async function preCompile(context: CompilationContext, preset: Preset) {
  return preset.preCompile
    ? Promise.all([createTSConfig(context), preset.preCompile(context)])
    : createTSConfig(context);
}

async function _compile(context: CompilationContext, cc: CompilerContext) {
  const pathToTSC = require.resolve('typescript/bin/tsc');
  !context.cc.dynamicConfig!.useExperimentalCache
    ? await runNodeScriptInDir(context.directory, pathToTSC, ['-d'])
    : await context.capsule.execNode(pathToTSC, ['-d']);

  const dists = await collectDistFiles(context);
  const nonCompiledDists = await collectNonDistFiles(context);
  const mainFile = findMainFile(context, dists);

  return { dists: dists.concat(nonCompiledDists), mainFile };
}

function getNonCompiledFiles(files: Vinyl[]) {
  return files.filter(f => {
    return !f.basename.endsWith('ts') && !f.basename.endsWith('tsx');
  });
}

export function findMainFile(context: CompilationContext, dists: Vinyl[]) {
  const compDistRoot = path.resolve(context.directory, FIXED_OUT_DIR);
  const getNameOfFile = (val: string, split: string) => val.split(split)[0];
  const sourceFileName = getNameOfFile(context.main, '.ts');
  const pathPrefix = `${compDistRoot}${compDistRoot.endsWith(path.sep) ? '' : path.sep}`;
  const distMainFileExt = '.js';
  const res = dists.find(val => {
    if (!val.path.endsWith(distMainFileExt)) {
      // makes sure to not pick up files such as '.js.map'
      return false;
    }
    const nameToCheck = getNameOfFile(val.path, distMainFileExt).split(pathPrefix)[1];
    return nameToCheck.endsWith(sourceFileName);
  });
  return (res || { relative: '' }).relative;
}

function createContext(
  res: GenericObject,
  directory: string,
  cc: CompilerContext,
  srcTestFiles: Vinyl[]
): CompilationContext {
  const componentObject = res.componentWithDependencies.component.toObject();
  return {
    main: componentObject.mainFile,
    dist: cc.context.rootDistDir,
    name: componentObject.name,
    capsule: res.capsule,
    directory,
    res,
    cc,
    srcTestFiles
  };
}

function getSrcTestFiles(files: Vinyl[]) {
  return files.filter(f => {
    return f.test === true;
  });
}

async function runNodeScriptInDir(directory: string, scriptFile: string, args: string[]) {
  let result = null;
  const cwd = process.cwd();
  try {
    process.chdir(directory);
    result = await execa(scriptFile, args, { stdout: 1 });
  } catch (e) {
    process.chdir(cwd);
    console.log();
    throw e;
  }
  process.chdir(cwd);
  return result;
}

async function createTSConfig(context: CompilationContext) {
  const configUserOverrides = context.cc.dynamicConfig!.tsconfig;
  const content: GenericObject = getTSConfig(false, configUserOverrides);
  const pathToConfig = getTSConfigPath(context);
  return fs.writeFile(pathToConfig, JSON.stringify(content, null, 4));
}

export async function collectDistFiles(context: CompilationContext): Promise<Vinyl[]> {
  const capsuleDir = context.directory;
  const compDistRoot = path.resolve(capsuleDir, FIXED_OUT_DIR);
  const files = await readdir(compDistRoot);
  const readFiles = await Promise.all(
    files.map(file => {
      return fs.readFile(file);
    })
  );
  return files.map((file, index) => {
    const relativePath = path.relative(path.join(capsuleDir, FIXED_OUT_DIR), file);
    const pathToFile = path.join(compDistRoot, relativePath);
    let test = false;
    // Only check js files not d.ts or .map files
    if (getExt(relativePath) === 'js') {
      // Don't compare extension name, it will surly be different.
      // the source is ts / tsx and the dist is js.
      test = isTestFile(context.srcTestFiles, relativePath, false);
    }
    return new Vinyl({
      path: pathToFile,
      contents: readFiles[index],
      base: compDistRoot,
      test
    });
  });
}

async function collectNonDistFiles(context: CompilationContext): Promise<Vinyl[]> {
  const copyPolicy: CopyPolicy = context.cc.dynamicConfig!.copyPolicy;

  if (copyPolicy.disable) {
    return Promise.resolve([]);
  }

  const capsuleDir = context.directory;
  const compDistRoot = path.resolve(capsuleDir, FIXED_OUT_DIR);
  const ignoreFunction = function(file: string, _stats: Stats) {
    if (file.endsWith('.d.ts')) {
      return false;
    }
    const defaultIgnore = ['node_modules/', FIXED_OUT_DIR, '.dependencies', '.ts'];
    return defaultIgnore.concat(copyPolicy.ignorePatterns).reduce(function(prev, curr) {
      return prev || !!~file.indexOf(curr);
    }, false);
  };
  const fileList = await readdir(capsuleDir, ['*.tsx', ignoreFunction]);
  const readFiles = await Promise.all(
    fileList.map(file => {
      return fs.readFile(file);
    })
  );
  const list = fileList.map((file, index) => {
    const relativePath = path.relative(capsuleDir, file);
    const pathToFile = path.join(compDistRoot, relativePath);
    const test = false;

    return new Vinyl({
      path: pathToFile,
      contents: readFiles[index],
      base: compDistRoot,
      test
    });
  });
  return list;
}

function getTSConfigPath(context: CompilationContext) {
  return path.join(context.directory, 'tsconfig.json');
}

function getExt(filename: string): string {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length); // readonly 1 to remove the '.'
}

function getWithoutExt(filename: string): string {
  const ext = getExt(filename);
  // There is no extension just return the file name
  if (ext === filename) {
    return filename;
  }
  return filename.substring(0, filename.length - ext.length - 1); // -1 to remove the '.'
}

function isTestFile(srcTestFiles: Vinyl[], fileToCheck: string, compareWithExtension: boolean = true) {
  const found = srcTestFiles.find(testFile => {
    if (compareWithExtension) {
      return testFile.relative === fileToCheck;
    }
    return getWithoutExt(testFile.relative).endsWith(getWithoutExt(fileToCheck));
  });
  return !!found;
}

export function getCapsuleName(ctx: CompilerContext) {
  const { name, version } = ctx.context.componentObject;
  const componentInProjectId = md5(`${ctx.context.rootDistDir}${name}${version}`);
  const targetDir = path.join(os.tmpdir(), 'bit', componentInProjectId);
  return targetDir;
}
