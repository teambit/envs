
import path from 'path'
import { GenericObject, CompilerContext } from '@bit/bit.envs.common.compiler-types';
import {createTSConfig, runNodeScriptInDir, createCompiler, CompilationContext} from '@bit/bit.envs.common.create-ts-compiler'
import tsconfig from './tsconfig'
import '@stencil/core'
import { promises as fs } from 'fs'


const compiledFileTypes = ['ts', 'tsx'];

export async function preCompile(context:CompilationContext, options:GenericObject) {
    await createTSConfig(context, options)
    await createStencilConfig(context, 
`import { Config } from '@stencil/core';

export const config: Config = {
    namespace: '${context.name}',
    outputTargets: [
    {
        type: 'dist',
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

async function runCompiler(context:CompilationContext) {
    const pathToStencil = require.resolve('@stencil/core/bin/stencil')
    await runNodeScriptInDir(context.directory, pathToStencil, ['build'])
}

export const compile = async ( cc:CompilerContext, distPath: string, api: GenericObject) => {
    const compilerOptions = tsconfig
    return createCompiler(preCompile, runCompiler)(cc, distPath, api, { fileTypes: compiledFileTypes, compilerOptions })
}

export async function createStencilConfig(context: CompilationContext, content: string) {
    const pathToConfig =  path.join(context.directory, 'stencil.config.ts')
    return fs.writeFile(pathToConfig, content)
}
