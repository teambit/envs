import { Compiler, InitAPI, CompilerContext, Logger } from "../../common/src/compiler";
import { compile } from './compile'
import {withCopiedFiles} from '../../common/src/copy-policy'
import Vinyl from 'vinyl'

const CONFIG_NAME = 'tsconfig'

export class TypescriptCompiler implements Compiler {
    private _logger: Logger | undefined
    
    init(ctx: { api: InitAPI }) {
       this._logger = ctx.api.getLogger()
        return {
            write: true
        }
    }
    
    getDynamicPackageDependencies(ctx: CompilerContext, name?: string )  {
        const config = ctx.configFiles.find((file) => file,name === CONFIG_NAME )
        if (!config) {
            console.error('can not find config');
            return {}
        }
        
        return {}
    }

    async action(ctx: CompilerContext) {
        const compileResult = await compile([], ctx.context.rootDistDir, ctx.context)
        return withCopiedFiles(ctx, compileResult)
    }
    
    get logger (): Logger |undefined {
        return this._logger
    }
} 



export function getPrinter() {
    let order = 1
    return function print(name:string, logger?:Logger) {
        console.log(`\n${name} is in order ${order++}`)
        if (name === 'action') { 
            order = 0
        }
    }
}

