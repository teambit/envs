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
import { isolate, DEBUG_FLAG } from '@bit/bit.envs.common.isolate';
import md5 from 'md5';
import os from 'os';

export async function compile(cc: CompilerContext, preset: Preset) {
  const isolateResult = await isolate(cc);
  const { res, directory } = isolateResult;
  const srcTestFiles = getSrcTestFiles(cc.files);
  const context = await createContext(res, directory, cc, srcTestFiles);
  let results = null;

  await preCompile(context, preset);
  const compiledFileTypes = preset.getDynamicConfig ? preset.getDynamicConfig(cc.rawConfig).compiledFileTypes : [];
  if (getNonCompiledFiles(cc.files, compiledFileTypes).length === cc.files.length) {
    const dists = await collectNonDistFiles(context);
    results = { dists };
  } else {
    results = await _compile(context, cc, preset);
  }

  if (!process.env[DEBUG_FLAG]) {
    await context.capsule.destroy();
  }
  if ((preset as any).enrichResult) {
    return (preset as any).enrichResult(results, context);
  }
  return results;
}

async function preCompile(context: CompilationContext, preset: Preset): Promise<any> {
  let promises = [createConfigFile(context)];

  if (preset.preCompile) {
    promises = [...promises, preset.preCompile(context)];
  }
  return Promise.all(promises);
}
async function runCompiler(action: () => Promise<any>, preset: Preset) {
  return preset.runCompiler ? Promise.all([action(), preset.runCompiler()]) : action();
}

async function _compile(context: CompilationContext, cc: CompilerContext, preset: Preset) {
  const pathToCompiler = require.resolve(cc.dynamicConfig!.compilerPath);
  const compilerArguments = cc.dynamicConfig!.compilerArguments;
  // await runNodeScriptInDir(context.directory, pathToCompiler, compilerArguments);
  await runCompiler(() => runNodeScriptInDir(context.directory, pathToCompiler, compilerArguments), preset);
  const dists = await collectDistFiles(context);
  const nonCompiledDists = await collectNonDistFiles(context);
  const mainFile = findMainFile(context, dists);

  return { dists: dists.concat(nonCompiledDists), mainFile };
}

export function getNonCompiledFiles(files: Vinyl[], compiledFileTypes: Array<string>) {
  return files.filter((f) => {
    return !compiledFileTypes.includes(f.extname);
  });
}

export function findMainFile(context: CompilationContext, dists: Vinyl[]) {
  const compDistRoot = path.resolve(context.directory, FIXED_OUT_DIR);
  const sourceFileName = getNameOfFile(context.main, context.main.substring(context.main.indexOf('.')));
  const pathPrefix = `${compDistRoot}${compDistRoot.endsWith(path.sep) ? '' : path.sep}`;
  const distMainFileExt = '.js';
  const res = dists.find((val) => {
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
    srcTestFiles,
  };
}

function getSrcTestFiles(files: Vinyl[]) {
  return files.filter((f) => {
    return f.test === true;
  });
}

async function runNodeScriptInDir(directory: string, scriptFile: string, args: string[]) {
  let result = null;
  const cwd = process.cwd();
  try {
    process.chdir(directory);
    if (process.env[DEBUG_FLAG]) {
      console.log(` ${scriptFile} ${args.toString().replace(',', ' ')}`);
    }
    result = await execa(scriptFile, args, { stdout: 1 });
  } catch (e) {
    process.chdir(cwd);
    console.log();
    throw e;
  }
  process.chdir(cwd);
  return result;
}

async function createConfigFile(context: CompilationContext): Promise<any> {
  const configFileName = context.cc.dynamicConfig!.configFileName; //example: typescript will be tsconfig.json
  const content: GenericObject = context.cc.dynamicConfig![getNameOfFile(configFileName, '.')]; //the key of the config file is defined by configFileName and can be dynamic.
  const pathToConfig = getConfigFilePath(context);
  return fs.writeFile(pathToConfig, JSON.stringify(content, null, 4));
}

export async function collectDistFiles(context: CompilationContext): Promise<Vinyl[]> {
  const capsuleDir = context.directory;
  const compDistRoot = path.resolve(capsuleDir, FIXED_OUT_DIR);
  const files = await readdir(compDistRoot);
  const readFiles = await Promise.all(
    files.map((file) => {
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
      test,
    });
  });
}

async function collectNonDistFiles(context: CompilationContext): Promise<Vinyl[]> {
  const dynamicConfig: GenericObject = context.cc.dynamicConfig!;
  const copyPolicy: CopyPolicy = dynamicConfig.copyPolicy;

  if (dynamicConfig.copyPolicy.disable) {
    return Promise.resolve([]);
  }

  const capsuleDir = context.directory;
  const compDistRoot = path.resolve(capsuleDir, FIXED_OUT_DIR);
  const ignoreFunction = function (file: string, _stats: Stats) {
    if (file.endsWith('.d.ts')) {
      return false;
    }
    const defaultIgnore = [`node_modules${path.sep}`, FIXED_OUT_DIR, '.dependencies'].concat(
      dynamicConfig.compiledFileTypes
    );
    return defaultIgnore.concat(copyPolicy.ignorePatterns).reduce(function (prev, curr) {
      return prev || !!~file.indexOf(curr);
    }, false);
  };
  const fileList = await readdir(capsuleDir, [ignoreFunction]);
  const readFiles = await Promise.all(
    fileList.map((file) => {
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
      test,
    });
  });
  return list;
}

const getNameOfFile = (val: string, split: string) => val.split(split)[0];

function getConfigFilePath(context: CompilationContext) {
  return path.join(context.directory, context.cc.dynamicConfig!.configFileName);
}

function getExt(filename: string): string {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length); // readonly 1 to remove the '.'
}

function getWithoutExt(filename: string): string {
  const ext = getExt(filename);
  // There is no extension just return the file name
  return ext === filename ? filename : filename.substring(0, filename.length - ext.length - 1);
}

function isTestFile(srcTestFiles: Vinyl[], fileToCheck: string, compareWithExtension: boolean = true) {
  const found = srcTestFiles.find((testFile) => {
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
