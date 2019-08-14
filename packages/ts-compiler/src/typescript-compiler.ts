import { Compiler, InitAPI, CompilerContext, Logger } from "./compiler";
import { compile } from './compile'
import Vinyl from 'vinyl'
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

    action(ctx: CompilerContext) {
        print('action')
        const files:Vinyl[] = []
        //const files = await compile([], 'dist-path', {api:'api'})
        return Promise.resolve({ files })
    }
    
    get logger (): Logger |undefined {
        return this._logger
    }
} 

let order = 1

function print(name:string) {
    console.log(`${name} is in order ${order++}`)
}
