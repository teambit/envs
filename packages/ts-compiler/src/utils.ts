import path from 'path';
const os = require('os');

export function getCapsuleName() {
    const uuidHack = `capsule-${Date.now().toString().slice(-5)}`;
    const targetDir = path.join(os.tmpdir(), 'bit', uuidHack);
    return targetDir;
}
