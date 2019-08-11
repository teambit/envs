import { Compiler, InitAPI, CompilerContext, Logger } from "./compiler";

export class TypescriptCompiler implements Compiler {
    private _logger: Logger | undefined
    
    init(ctx: { api: InitAPI }) {
        this._logger = ctx.api.getLogger()
        return {
            write: true
        }
    }
    
    getDynamicPackageDependencies(ctx: CompilerContext, name?: string )  {
        return {}
    }

    getDynamicConfig(ctx:CompilerContext){
        return {}
    }

    action(ctx: CompilerContext) {
        return Promise.resolve({files:[]})
    }
    
    get logger (): Logger|undefined {
        return this.logger
    }
} 

