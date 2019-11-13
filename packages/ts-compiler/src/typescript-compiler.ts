import { Compiler, InitAPI, CompilerContext, Logger, ActionReturnType } from "./compiler";
import { compile } from './compile'
import { DependenciesJSON, Preset, presetStore } from "./preset";

const CONFIG_NAME = 'tsconfig'

export class TypescriptCompiler implements Compiler {
    private preset: Preset = presetStore.NONE
    init(ctx: { api: InitAPI }) {
        return {
            write: true
        }
    }

    getDynamicPackageDependencies(ctx: CompilerContext, name?: string) {
        return this.preset.getDynamicPackageDependencies 
            ? this.preset.getDynamicPackageDependencies()
            : {}
    }
    
    getDynamicConfig(ctx: CompilerContext) {
        const config = Object.assign({
            tsconfig: {},
            development: false, 
            copyPolicy: {
                ignorePatterns: ['package.json', 'package-lock.json', 'tsconfig.json'], 
                disable: false 
            }
        }, ctx.rawConfig)
        this.preset = presetStore[config.preset || 'NONE']
        return config
    }

    async action(ctx: CompilerContext):Promise<ActionReturnType> {
        const compileResult = await compile(ctx, this.preset)
        return compileResult
    }
}
