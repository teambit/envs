import { Compiler, InitAPI, CompilerContext, Logger, ActionReturnType } from "./compiler";
import { compile } from './compile'
import { Preset, presetStore } from "./preset";
import {merge} from 'lodash'

const CONFIG_NAME = 'tsconfig'

export class TypescriptCompiler implements Compiler {
    private _logger: Logger | undefined
    private preset: Preset

    constructor(preset = 'NONE') {
        this.preset = presetStore[preset] || presetStore.NONE
        this.getDynamicPackageDependencies = this.getDynamicPackageDependencies.bind(this)
        this.getDynamicConfig = this.getDynamicConfig.bind(this)
        this.action = this.action.bind(this)
    }

    init(ctx: { api: InitAPI }) {
        this._logger = ctx.api.getLogger()
        return {
            write: true
        }
    }

    getDynamicPackageDependencies(ctx: CompilerContext, name?: string) {
        const deps = this.preset.getDynamicPackageDependencies 
            ? this.preset.getDynamicPackageDependencies()
            : {}
        return deps
    }
    getDynamicConfig(ctx: CompilerContext) {
        let defaultConfig = {
            tsconfig: {},
            development: false, 
            copyPolicy: {
                ignorePatterns: ['package.json', 'package-lock.json', 'tsconfig.json'], 
                disable: false 
            }
        }
        const presetConfig = this.preset.getDynamicConfig ? this.preset.getDynamicConfig(): {}
        const config =  merge({}, defaultConfig, presetConfig, ctx.rawConfig) 
        return config
    }

    async action(compilerContext: CompilerContext):Promise<ActionReturnType> {
        const compileResult = await compile(compilerContext, this.preset)
        return compileResult
    }

    get logger(): Logger | undefined {
        return this._logger
    }
}

