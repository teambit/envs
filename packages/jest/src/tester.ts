import { TesterContext } from './tester-types';
import { Preset } from '@bit/bit.envs.common.preset';
import { isolate } from '@bit/bit.envs.common.isolate';
import fs from 'fs-extra';
export interface TestResult {
  title: string;
  fullTitle: string;
  duration: number | undefined;
  currentRetry: number;
  err: object;
}

export async function runTester(tc: TesterContext, preset: Preset) {
  debugger;
  console.log('before');
  const { res, directory } = await isolate(tc, { writeDists: true });
  console.log('capsule directory: ', directory);
  await placeTestFilesInCapsule(tc);
  await run();
  const results = await collectResults();

  if (!process.env.DEBUG_FLAG) {
    // await tc.context.capsule.destroy()
  }

  return results;
}

export function placeTestFilesInCapsule(tc: TesterContext) {}
export function collectResults() {
  return Promise.resolve([]);
}
export async function run() {
  return Promise.resolve([]);
}
