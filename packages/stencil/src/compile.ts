
import { GenericObject, CompilerContext } from '@bit/bit.envs.common.compiler-types';
import {createTSConfig, createStencilConfig, runNodeScriptInDir, createCompiler} from '@bit/bit.envs.common.create-ts-compiler'


const DEBUG_FLAG = 'DEBUG'
const compiledFileTypes = ['ts', 'tsx'];
import tsconfig from './tsconfig'

export interface CompilationContext {
    directory: string
    name: string,
    main: string,
    dist: string,
    dependencies: GenericObject,
    capsule: GenericObject,
    res: GenericObject
}

export async function preCompile(context:CompilationContext, options:GenericObject) {
    await createTSConfig(context, options)
    await createStencilConfig(context, 
`import { Config } from '@stencil/core';

export const config: Config = {
    namespace: '${'name'}',
    outputTargets: [
    {
        type: 'dist',
        esmLoaderPath: '../loader'
    },
    {
        type: 'docs-readme'
    },
    {
        type: 'www',
        serviceWorker: null // disable service workers
    }]
};
`)
}

export type RunCompiler = (ctx:CompilationContext) => Promise<void>
export type PreCompile = (ctx:CompilationContext, options:GenericObject) => Promise<void>

async function runCompiler(context:CompilationContext) {
    const pathToStencil = require.resolve('@stencil/core/bin/stencil')
    await runNodeScriptInDir(context.directory, pathToStencil, ['build'])
}

export const compile = async ( cc:CompilerContext, distPath: string, api: GenericObject) => {
    const compilerOptions = tsconfig
    return createCompiler(preCompile, runCompiler)(cc, distPath, api, { fileTypes: compiledFileTypes, compilerOptions })
}

