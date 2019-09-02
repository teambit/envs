import path from 'path'
import execa from 'execa'
import readdir from 'recursive-readdir'
import Vinyl from 'vinyl'
import { promises as fs } from 'fs'
import { GenericObject } from './compiler';

import 'typescript'

const os = require('os')
const DEBUG_FLAG = 'DEBUG'

const compiledFileTypes = ['ts', 'tsx'];
const tsconfig = require(path.join(__dirname, './tsconfig.json'));

export const compile = async (files: Vinyl[], distPath: string, api: GenericObject) => {
    const compilerOptions = tsconfig
    return typescriptCompile(files, distPath, api, { fileTypes: compiledFileTypes, compilerOptions })
}

const typescriptCompile = async (_files: Vinyl[], distPath: string, api: GenericObject, extra: { fileTypes: string[], compilerOptions: GenericObject }) => {
    const { res, directory } = await isolate(api)
    const context = await createContext(res, directory, distPath)

    await createTSConfig(context, extra.compilerOptions)
    const results = await _compile(context)

    if (!process.env[DEBUG_FLAG]) {
        await context.capsule.destroy()
    }

    return results
}

async function _compile(context: CompilationContext) {
    const pathToTSC = require.resolve('typescript/bin/tsc')
    await runNodeScriptInDir(context.directory, pathToTSC, ['-d'])
    const dists = await collectDistFiles(context)
    const mainFile = findMainFile(context, dists)
    return { dists, mainFile }
}

export function findMainFile(context, dists) {
    const getNameOfFile = (val, split) => val.split(split)[0]
    const sourceFileName = getNameOfFile(context.main, '.ts')
    const res = dists.find((val)=> {
        return  sourceFileName === getNameOfFile(val.basename, '.js')
    })
    return (res || {}).path
}

function createContext(res: GenericObject, directory: string, distPath: string): CompilationContext {
    const componentObject = res.componentWithDependencies.component.toObject()
    return {
        main: componentObject.mainFile,
        dist: distPath,
        name: componentObject.name,
        dependencies: getCustomDependencies(directory),
        capsule: res.capsule,
        directory
    }
}


async function runNodeScriptInDir(directory: string, scriptFile: string, args: string[]) {
    let result = null
    const cwd = process.cwd()
    try {
        process.chdir(directory)
        result = await execa(scriptFile, args)
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
    const uuidHack = `capsule-${Date.now().toString().slice(-5)}`
    const targetDir = path.join(os.tmpdir(), 'bit', uuidHack)
    const componentName = api.componentObject.name
    print(`\n building ${componentName} on directory ${targetDir}`)

    const res = await api.isolate({ targetDir, shouldBuildDependencies: true })

    return { res, directory: targetDir }
}

async function collectDistFiles(context: CompilationContext) {
    const capsuleDir = context.directory
    const compDistDir = path.resolve(capsuleDir, 'dist')
    const files = await readdir(compDistDir)
    const readFiles = await Promise.all(files.map(file => {
        return fs.readFile(file)
    }))
    return files.map((file, index) => {
        return new Vinyl({
            path: path.join(context.name, file.split(path.join(capsuleDir, 'dist'))[1]),
            contents: readFiles[index]
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

export interface CompilationContext {
    directory: string,
    name: string,
    main: string,
    dist: string,
    dependencies: GenericObject,
    capsule: GenericObject,

}