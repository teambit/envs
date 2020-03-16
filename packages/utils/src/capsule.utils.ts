import * as path from 'path';
import * as os from 'os';
import debug from 'debug';

import { IsolateOptions } from './types';

if (process.env.DEBUG) {
  debug('capsule');
}

export function getCapsuleName(infix: string = '') {
  const uuidHack = `capsule-${infix ? `${infix}-` : ''}${Date.now()
    .toString()
    .slice(-5)}`;
  return path.join(os.tmpdir(), 'bit', uuidHack);
}

export async function createCapsule(
  isolate: (isolateOptions: IsolateOptions) => any,
  isolateOptions: Record<string, any> = {},
  capsulePath?: string
) {
  const targetDir = capsulePath || getCapsuleName();
  debug(`\n building capsule on directory ${targetDir}`);
  const actualOpts = { ...{ targetDir, shouldBuildDependencies: true }, ...(isolateOptions || {}) };
  const res = await isolate(actualOpts);
  return { res, directory: targetDir };
}

export async function destroyCapsule(capsule: any): Promise<void> {
  if (!process.env['DEBUG']) {
    await capsule.destroy();
  }
}
