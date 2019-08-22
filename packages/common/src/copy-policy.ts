import Vinyl from 'vinyl'
import { CompilerContext } from './compiler';

export function withCopiedFiles(ctx:CompilerContext, results:{dists: Vinyl.BufferFile[]}) {
    if (!ctx!.rawConfig.copyGlob) {
        ctx.rawConfig.copyGlobs = './**/*.{less, scss, json}'
    }
    
    ctx.files.forEach(file => {
        
    })
    
    return results
}