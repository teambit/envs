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
    cc: CompilerContext
}

export async function compile(cc:CompilerContext, _preset: Preset) {
    const { res, directory } = await isolate(cc)
    const context = await createContext(res, directory, cc)
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

function createContext(res: GenericObject, directory: string, cc:CompilerContext): CompilationContext {
    const componentObject = res.componentWithDependencies.component.toObject()
    return {
        main: componentObject.mainFile,
        dist: cc.context.rootDistDir,
        name: componentObject.name,
        capsule: res.capsule,
        directory,
        res,
        cc
    }
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
        const pathToFile = path.join(compDistRoot, file.split(path.join(capsuleDir, 'dist'))[1])
        return new Vinyl({
            path: pathToFile,
            contents: readFiles[index],
            base: compDistRoot
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
        const defaultIgnore = [
            '/node_modules/',
            '/dist/',
            '.dependencies',
        ]
        return defaultIgnore.concat(copyPolicy.ignorePatterns)
                     .reduce(function (prev, curr) {
                        return prev || !!~file.indexOf(curr)
                     }, false)
    }

    const fileList = await readdir(capsuleDir, ['*.ts', '*.tsx', ignoreFunction])
    const readFiles = await Promise.all(fileList.map(file => {
        return fs.readFile(file)
    }))
    const list = fileList.map((file, index) => {
        const pathToFile = path.join(compDistRoot, file.split(capsuleDir)[1])

        return new Vinyl({
            path: pathToFile,
            contents: readFiles[index],
            base: compDistRoot
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