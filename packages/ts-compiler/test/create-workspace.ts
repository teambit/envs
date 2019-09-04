import { getCapsuleName } from '../src/utils'
import { promises as fs } from 'fs'
import mkdirp, { Options } from 'mkdirp'
import path from 'path'

export async function createWorkspace(content: WorkspaceContent): Promise<string> {
    const targetDir = getCapsuleName()
    await mkdirpPromise(targetDir, {})
    await Object.keys(content).map( async key => {
        const containingFolder = path.dirname(key)
        await mkdirpPromise(containingFolder, {})
        await fs.writeFile(key, content[key])
    })

    // insert actions on workspace
    return targetDir
}

export interface WorkspaceContent {
    [k: string]: string 
}

export function mkdirpPromise(dir: string, opts: Options) {
    return new Promise((resolve, reject) => {
        mkdirp(dir, opts, (err, made) => err === null ? resolve(made) : reject(err))
    })
}