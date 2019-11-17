import { CompilerContext, GenericObject } from '@bit/bit.envs.common.compiler-types'
import {
  CompilationContext,
  createCompiler,
  createTSConfig,
  runNodeScriptInDir,
} from '@bit/bit.envs.common.create-ts-compiler'
import '@stencil/core'
import { promises as fs, Stats } from 'fs'
import path from 'path'
import tsconfig from './tsconfig'

const compiledFileTypes = ['ts', 'tsx']

export async function preCompile(context: CompilationContext, options: GenericObject) {
  await createTSConfig(context, options)
  await createStencilConfig(
    context,
    `import { Config } from '@stencil/core';

export const config: Config = {
    namespace: '${context.name}',
    outputTargets: [
    {
        type: 'dist'
    }]
};
`
  )
  await adjustPackageJsonInFS(context)
}

async function adjustPackageJsonInFS(context: CompilationContext) {
  const pathToPkJson = path.resolve(context.directory, 'package.json')
  const packageJsonRawContent = await fs.readFile(pathToPkJson, 'utf8')
  const packageJson = JSON.parse(packageJsonRawContent)
  adjustPackageJson(context, packageJson)
  await fs.writeFile(pathToPkJson, JSON.stringify(packageJson, null, 4))
}

function adjustPackageJson(context: CompilationContext, content: GenericObject) {
  content.main = `dist/index.js`
  content.module = 'dist/index.mjs'
  content.collection = 'dist/collection/collection-manifest.json'
  content.types = `dist/types/${
    context.main.endsWith('.ts') ? context.main.split('.ts')[0] : context.main.split('.tsx')[0]
  }.d.ts`
}

async function runCompiler(context: CompilationContext) {
  const pathToStencil = require.resolve('@stencil/core/bin/stencil')
  await runNodeScriptInDir(context.directory, pathToStencil, ['build'])
}

export const compile = async (cc: CompilerContext, distPath: string, api: GenericObject) => {
  const compilerOptions = tsconfig
  return createCompiler(preCompile, runCompiler, ignoreFunction)(cc, distPath, api, {
    fileTypes: compiledFileTypes,
    compilerOptions,
  })
}

export async function createStencilConfig(context: CompilationContext, content: string) {
  const pathToConfig = path.join(context.directory, 'stencil.config.ts')
  return fs.writeFile(pathToConfig, content)
}

const ignoreFunction = function(file: string, stats: Stats) {
  return (
    !~file.indexOf('/node_modules/') ||
    !!~file.indexOf('/dist/') ||
    !!~file.indexOf('.dependencies') ||
    !!~file.indexOf('www')
  )
}
