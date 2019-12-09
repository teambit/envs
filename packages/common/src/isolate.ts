import { getCapsuleName } from './get-capsule-name';
import { CompilerContext, GenericObject } from './compiler-types';

export const DEBUG_FLAG = 'DEBUG';

function print(msg: string) {
  process.env[DEBUG_FLAG] && console.log(msg);
}

export async function isolate(cc: CompilerContext, isolateOptions?: GenericObject, capsulePath?: string) {
  const api = cc.context;
  const targetDir = capsulePath || getCapsuleName();
  const componentName = api.componentObject.name;
  print(`\n building ${componentName} on directory ${targetDir}`);
  const actualOpts = { ...{ targetDir, shouldBuildDependencies: true }, ...(isolateOptions || {}) };
  const res = await api.isolate(actualOpts);

  return { res, directory: targetDir };
}
