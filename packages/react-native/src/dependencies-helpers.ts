import * as fs from 'fs-extra';
import { merge, has } from 'lodash';
import { GenericObject } from '@bit/bit.envs.common.compiler-types';

export function getDependencieVersion(packageDeps: GenericObject, dep: string, type?: string): string {
  if (!has(packageDeps, dep)) {
    throw new Error(
      `The ${type ? type : 'plugin/preset'} ${dep} you added need to be installed in your package.json file`
    );
  }
  return packageDeps[dep];
}

export function getPackageDependencies(path: string): GenericObject {
  let file;
  try {
    file = fs.readFileSync(path);
  } catch (error) {
    throw error;
  }
  let deps: GenericObject = JSON.parse(file.toString());
  deps = merge(deps.dependencies, deps.devDependencies, deps.peerDependencies);
  return deps;
}
