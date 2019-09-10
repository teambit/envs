import path, { relative } from 'path'
import execa from 'execa'
import readdir from 'recursive-readdir'
import Vinyl from 'vinyl'
import { promises as fs } from 'fs'
import { GenericObject, CompilerContext } from './compiler';

import 'typescript'

const DEBUG_FLAG = 'DEBUG'

const compiledFileTypes = ['ts', 'tsx'];
import tsconfig from './tsconfig'
import { getCapsuleName } from './utils';

export interface CompilationContext {
    directory: string
    name: string,
    main: string,
    dist: string,
    dependencies: GenericObject,
    capsule: GenericObject,
    res: GenericObject
}

export const compile = async ( cc:CompilerContext, distPath: string, api: GenericObject) => {
    const compilerOptions = tsconfig
    return typescriptCompile(cc, distPath, api, { fileTypes: compiledFileTypes, compilerOptions })
}

const typescriptCompile = async (cc:CompilerContext, distPath: string, api: GenericObject, extra: { fileTypes: string[], compilerOptions: GenericObject }) => {
    const { res, directory } = await isolate(api)
    const context = await createContext(res, directory, distPath)

    await createTSConfig(context, extra.compilerOptions)
    const results = await _compile(context, cc)

    if (!process.env[DEBUG_FLAG]) {
        await context.capsule.destroy()
    }

    return results
}

async function _compile(context: CompilationContext, cc:CompilerContext) {
    const pathToTSC = require.resolve('typescript/bin/tsc')
    await runNodeScriptInDir(context.directory, pathToTSC, ['-d'])
    const dists = await collectDistFiles(context)
    const nonCompiledDists = await collectNonDistFiles(context, cc.files)
    const mainFile = findMainFile(context, dists)
    return { dists: dists.concat(nonCompiledDists), mainFile }
}

export function collectNonDistFiles(context: CompilationContext, files:Vinyl[]) { 
    const originallySharedDir = context.res.componentWithDependencies.component.originallySharedDir
    const nonCompiledDists:Vinyl[] =  files.filter((f) => {
        return !f.basename.endsWith('ts') && !f.basename.endsWith('tsx')
    }).map((f) => {
        const newFile = f.clone()
        newFile.base = path.join(context.directory, 'dist')

        let realtiveFile = f.path.split(process.cwd())[1]
        if (realtiveFile.startsWith(`/${originallySharedDir}`)) {
            realtiveFile = realtiveFile.split(originallySharedDir)[1]
        }
        newFile.path = path.join(newFile.base, realtiveFile)
        return newFile
    })
    return nonCompiledDists
}

export function findMainFile(context: CompilationContext, dists: Vinyl[]) {
    const compDistRoot = path.resolve(context.directory, 'dist/')
    const getNameOfFile = (val:string, split:string) => val.split(split)[0]
    const sourceFileName = getNameOfFile(context.main, '.ts')
    const res = dists.find((val)=> {
        const nameToCheck = getNameOfFile(val.path, '.js').split(`${compDistRoot}${compDistRoot.endsWith('/') ? '':'/'}`)[1]
        return sourceFileName.endsWith(nameToCheck);
    })
    return  (res || {relative:''}).relative
}

function createContext(res: GenericObject, directory: string, distPath: string): CompilationContext {
    const componentObject = res.componentWithDependencies.component.toObject()
    return {
        main: componentObject.mainFile,
        dist: distPath,
        name: componentObject.name,
        dependencies: getCustomDependencies(directory),
        capsule: res.capsule,
        directory,
        res
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


function createTSConfig(context: CompilationContext, content: GenericObject) {
    const pathToConfig = getTSConfigPath(context)
    content.compilerOptions.outDir = 'dist'
    return fs.writeFile(pathToConfig, JSON.stringify(content, null, 4))
}

//@TODO refactor out of here and share with angular compiler.
async function isolate(api: GenericObject) {
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

function getTSConfigPath(context: CompilationContext) {
    return path.join(context.directory, 'tsconfig.json')
}

function getCustomDependencies(dir: string) {
    return Object.keys(require(`${dir}/package.json`).dependencies || {})
}

function print(msg: string) {
    process.env[DEBUG_FLAG] && console.log(msg)
}