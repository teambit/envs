import path from 'path';
import { CompilerContext } from './compiler';
import md5 from 'md5'
const os = require('os');

export function getCapsuleName(ctx: CompilerContext, infix:string = '')  {
    const { rootDistDir, componentObject, context } = ctx
    const { name, version } = context.componentObject
    const componentInProjectId = md5(`${rootDistDir}${name}${version}`)
    // const uuidHack = `capsule-${infix  ? '' : `${infix}-`}${Date.now().toString().slice(-5)}`;
    const targetDir = path.join(os.tmpdir(), 'bit', componentInProjectId);
    return targetDir;
}
