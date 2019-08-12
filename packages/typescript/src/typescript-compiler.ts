import { Compiler, InitAPI, CompilerContext, Logger } from "./compiler";
import { compile } from './compile'

let order = 1
export class TypescriptCompiler implements Compiler {
    private _logger: Logger | undefined
    
    init(ctx: { api: InitAPI }) {
        print('init')
        this._logger = ctx.api.getLogger()
        return {
            write: true
        }
    }
    
    getDynamicPackageDependencies(ctx: CompilerContext, name?: string )  {
        print('getDynamicPackageDependencies')
        return {}
    }

    getDynamicConfig(ctx:CompilerContext){
        print('getDynamicConfig')
        return {}
    }

    async action(ctx: CompilerContext) {
        print('action')
        debugger
        const files = null
        //const files = await compile([], 'dist-path', {api:'api'})
        return { files }
    }
    
    get logger (): Logger |undefined {
        return this._logger
    }
} 

function print(name:string) {
    console.log(`${name} is in order ${order++}`)
}
