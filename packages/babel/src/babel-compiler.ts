import { Compiler, InitAPI, CompilerContext, Logger } from "./compiler";

const CONFIG_FILE_NAMES = ['.babelrc', '.babelrc.js', 'babel.config.js']

const defaultConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry'
      }
    ]
  ]
}

export class BabelCompiler implements Compiler {
    private _logger: Logger | undefined
    
    init(ctx: { api: InitAPI }) {
        this._logger = ctx.api.getLogger()
        return {
            write: true
        }
    }
    
    getDynamicPackageDependencies (ctx: CompilerContext, name?: string )  {
      return {}
    }

    getDynamicConfig (ctx: CompilerContext, name?: string )  {
      // TODO: CONTINUE HERE (02/09) - get this to read the .babelrc file and return it as a js object
      // - write a basic one that gets preset-env in ~/code/envs-tester
      // - return this and then see that it works, get it in action, do the compilation magic and see that it compiles
      // - once this works, write a basic test for everything
      // 
      // - also, when bored, write the spec for the README file (specifying that rawConfig is just .babelrc that will override project and defaults)
      // - specify defaults in different section and fill them as we develop, etc.
      //
      //
      // - then test this with: https://bit.dev/bit/envs/testers/mocha
        console.log('*********************************************')
        console.log('getDynamicConfig: ctx', ctx)
        console.log('*********************************************')
        const config = ctx.configFiles.find((file) => CONFIG_FILE_NAMES.includes(file.name)) // TODO: sort in case of multiple matching config files
        console.log('config121212lk1j2:', config)
        return Object.assign({}, defaultConfig, config || {}, ctx.rawConfig)
    }

    async action(ctx: CompilerContext) {
      console.log('*********************************************')
      // console.log('action1', JSON.stringify(ctx, null, 2))
      console.log('*********************************************')
      return {dists: []}
//        const compileResult = await compile([], ctx.context.rootDistDir, ctx.context)
//        return withCopiedFiles(ctx, compileResult)
    }
    
    get logger (): Logger |undefined {
        return this._logger
    }
} 



// export function getPrinter() {
//     let order = 1
//     return function print(name:string, logger?:Logger) {
//         console.log(`\n${name} is in order ${order++}`)
//         if (name === 'action') { 
//             order = 0
//         }
//     }
// }
// 
