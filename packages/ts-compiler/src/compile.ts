import path, { relative, sep } from 'path'
import execa from 'execa'
import readdir from 'recursive-readdir'
import Vinyl from 'vinyl'
import { promises as fs, Stats } from 'fs'
import { GenericObject, CompilerContext } from './compiler';

import 'typescript'

const DEBUG_FLAG = 'DEBUG'
const compiledFileTypes = ['ts', 'tsx'];
import {getTSConfig} from './tsconfig'
import { getCapsuleName } from './utils';
import { Preset, CopyPolicy } from './preset'

export interface CompilationContext {
    directory: string
    name: string,
    main: string,
    dist: string,
    capsule: GenericObject,
    res: GenericObject,
    cc: CompilerContext,
    srcTestFiles: Vinyl[]
}

export async function compile(cc:CompilerContext, _preset: Preset) {
    const { res, directory } = await isolate(cc)
    const srcTestFiles = getSrcTestFiles(cc.files)
    const context = await createContext(res, directory, cc, srcTestFiles)
    let results = null
    await createTSConfig(context)
    if (getNonCompiledFiles(cc.files).length === cc.files.length) {
        const dists = await collectNonDistFiles(context)
        results = {dists}
    } else {
        results = await _compile(context, cc)
    }

    if (!process.env[DEBUG_FLAG]) {
        await context.capsule.destroy()
    }
    return results
}

async function _compile(context: CompilationContext, cc:CompilerContext) {
    const pathToTSC = require.resolve('typescript/bin/tsc')
    await runNodeScriptInDir(context.directory, pathToTSC, ['-d'])
    const dists = await collectDistFiles(context)
    const nonCompiledDists = await collectNonDistFiles(context)
    const mainFile = findMainFile(context, dists)
    return { dists: dists.concat(nonCompiledDists), mainFile }
}

function getNonCompiledFiles(files:Vinyl[]) {
    return files.filter((f) => {
        return !f.basename.endsWith('ts') && !f.basename.endsWith('tsx')
    })
}

export function findMainFile(context: CompilationContext, dists: Vinyl[]) {
    const compDistRoot = path.resolve(context.directory, 'dist/')
    const getNameOfFile = (val:string, split:string) => val.split(split)[0]
    const sourceFileName = getNameOfFile(context.main, '.ts')
    const pathPrefix = `${compDistRoot}${compDistRoot.endsWith('/') ? '':'/'}`
    const distMainFileExt = '.js'
    const res = dists.find((val)=> {
        if (!val.path.endsWith(distMainFileExt)) {
            // makes sure to not pick up files such as '.js.map'
            return false;
        }
        const nameToCheck = getNameOfFile(val.path, distMainFileExt).split(pathPrefix)[1]
        return sourceFileName.endsWith(nameToCheck);
    })
    return  (res || {relative:''}).relative
}

function createContext(res: GenericObject, directory: string, cc:CompilerContext, srcTestFiles: Vinyl[]): CompilationContext {
    const componentObject = res.componentWithDependencies.component.toObject()
    return {
        main: componentObject.mainFile,
        dist: cc.context.rootDistDir,
        name: componentObject.name,
        capsule: res.capsule,
        directory,
        res,
        cc,
        srcTestFiles
    }
}

function getSrcTestFiles(files: Vinyl[]) {
    return files.filter((f) => {
        return f.test === true;
    })
}

async function runNodeScriptInDir(directory: string, scriptFile: string, args: string[]) {
    let result = null
    const cwd = process.cwd()
    try {
        process.chdir(directory)
        result = await execa(scriptFile, args,{stdout:1})
    } catch (e) {
        process.chdir(cwd)
        throw e
    }
    process.chdir(cwd)
    return result
}


async function createTSConfig(context: CompilationContext) {
    const configUserOverrides = context.cc.dynamicConfig!.tsconfig
    const content:GenericObject = getTSConfig(false, configUserOverrides)
    const pathToConfig = getTSConfigPath(context)
    content.compilerOptions.outDir = 'dist'
    return fs.writeFile(pathToConfig, JSON.stringify(content, null, 4))
}

async function isolate(cc: CompilerContext) {
    const api = cc.context
    const targetDir = getCapsuleName();
    const componentName = api.componentObject.name
    print(`\n building ${componentName} on directory ${targetDir}`)

    const res = await api.isolate({ targetDir, shouldBuildDependencies: true })

    return { res, directory: targetDir }
}

async function collectDistFiles(context: CompilationContext): Promise<Vinyl[]> {
    const capsuleDir = context.directory
    const compDistRoot = path.resolve(capsuleDir, 'dist')
    const files = await readdir(compDistRoot)
    const readFiles = await Promise.all(files.map(file => {
        return fs.readFile(file)
    }))
    return files.map((file, index) => {
        const relativePath = path.relative(path.join(capsuleDir, 'dist'), file)
        const pathToFile = path.join(compDistRoot, relativePath)
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
        })
    })
}

async function collectNonDistFiles(context:CompilationContext): Promise<Vinyl[]> {
    const copyPolicy:CopyPolicy = context.cc.dynamicConfig!.copyPolicy
    
    if (copyPolicy.disable){
        return Promise.resolve([])
    }
    
    const capsuleDir = context.directory
    const compDistRoot = path.resolve(capsuleDir, 'dist')
    const ignoreFunction = function (file:string, _stats: Stats) {
        console.log('file', file)
        if (file.endsWith('.d.ts')){
            return false
        }
        const defaultIgnore = [
            '/node_modules/',
            '/dist/',
            '.dependencies',
            '.ts'
        ]
        return defaultIgnore
                .concat(copyPolicy.ignorePatterns)
                .reduce(function (prev, curr) {
                    return prev || !!~file.indexOf(curr)
                }, false)
    }
    const fileList = await readdir(capsuleDir, ['*.tsx', ignoreFunction])
    const readFiles = await Promise.all(fileList.map(file => {
        return fs.readFile(file)
    }))
    const list = fileList.map((file, index) => {
        const relativePath = path.relative(capsuleDir, file)
        const pathToFile = path.join(compDistRoot, relativePath)
        const test = isTestFile(context.srcTestFiles, relativePath);

        return new Vinyl({
            path: pathToFile,
            contents: readFiles[index],
            base: compDistRoot,
            test
        })
    })
    return list
}

function getTSConfigPath(context: CompilationContext) {
    return path.join(context.directory, 'tsconfig.json')
}

function print(msg: string) {
    process.env[DEBUG_FLAG] && console.log(msg)
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
    const found = srcTestFiles.find((testFile) => {
        if (compareWithExtension) {
            return testFile.relative === fileToCheck;
        }
        return getWithoutExt(testFile.relative) === getWithoutExt(fileToCheck);
    })
    return !!found;
}