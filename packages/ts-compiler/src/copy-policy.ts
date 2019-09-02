import Vinyl from 'vinyl'
import { CompilerContext } from './compiler';
import minimatch from 'minimatch'

export function withCopiedFiles(ctx:CompilerContext, results:{ dists: Vinyl[]}) {
    if (!ctx.rawConfig.copyGlob) {
        ctx.rawConfig.copyGlobs = './**/*.{less, scss, json}'
    }
    debugger
    ctx.files.filter(file => {
       return minimatch(file.base, ctx.rawConfig.copyGlob)
    }).forEach(toCopy => { 
       console.log(toCopy.base) 
    })
    
    return results
}