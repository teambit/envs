import { getCapsuleName } from './get-capsule-name';
import { CompilerContext } from './compiler-types';

export const DEBUG_FLAG = 'DEBUG';

function print(msg: string) {
  process.env[DEBUG_FLAG] && console.log(msg);
}

export async function isolate(cc: CompilerContext) {
  const api = cc.context;
  const targetDir = getCapsuleName();
  const componentName = api.componentObject.name;
  print(`\n building ${componentName} on directory ${targetDir}`);

  const res = await api.isolate({ targetDir, shouldBuildDependencies: true });

  return { res, directory: targetDir };
}
