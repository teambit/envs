import { Compiler, InitAPI, CompilerContext, Logger } from "./compiler";
import { compile } from './compile'
import Vinyl from 'vinyl'

export class TypescriptCompiler implements Compiler {
    private _logger: Logger | undefined
    constructor() {
        console.log('\n~~~~~~~~~~~~~~~~~~WOW~~~~~~~~~~~~~~~~~~')
    }
    
    init(ctx: { api: InitAPI }) {
        debugger
        print('init')
        this._logger = ctx.api.getLogger()
        return {
            write: true
        }
    }
    
    getDynamicPackageDependencies(ctx: CompilerContext, name?: string )  {
        debugger
        print('getDynamicPackageDependencies')
        return {}
    }

    getDynamicConfig(ctx:CompilerContext){
        debugger
        print('getDynamicConfig')
        return {}
    }

    async action(ctx: CompilerContext) {
        debugger
        print('action')
        // const files:Vinyl[] = []
        const compileResult = await compile([], ctx.context.rootDistDir, ctx.context)
        debugger
        return compileResult
    }
    
    get logger (): Logger |undefined {
        return this._logger
    }
} 

let order = 1

function print(name:string) {
    console.log(`\n${name} is in order ${order++}`)
    if (name === 'action') { 
        order = 0
    }
}
