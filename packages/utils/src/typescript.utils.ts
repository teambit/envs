import path from 'path';
import merge from 'deepmerge'; // deep merge is required
import * as fs from 'fs';

export async function createTS(
  rootDir: string,
  TSConfig: Partial<{ [x: string]: any }>,
  rawConfig: Partial<{ [x: string]: any }>,
  options?: Partial<{ [x: string]: any }>
) {
  let TS = merge(rawConfig, options || {});
  TS = merge(TSConfig, TS);
  const TSFile = path.resolve(rootDir, 'tsconfig.json');
  fs.writeFileSync(TSFile, JSON.stringify(TS, null, 4));
  return TSFile;
}
