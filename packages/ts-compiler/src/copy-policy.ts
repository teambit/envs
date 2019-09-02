import Vinyl from 'vinyl'
import { CompilerContext } from './compiler';

export function withCopiedFiles(ctx:CompilerContext, results:{ dists: Vinyl[]}) {
    const files = ctx.files
    const toCopy = files.filter(function(file){
        return !file.path.endsWith('ts') && !file.path.endsWith('tsx')
    })

    results.dists.concat(toCopy)
    return results
}