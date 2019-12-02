import { TesterContext, TesterOutput } from './tester-types';
import { Preset } from '@bit/bit.envs.common.preset';
import { isolate, DEBUG_FLAG } from '@bit/bit.envs.common.isolate';
export interface TestResult {
  title: string;
  fullTitle: string;
  duration: number | undefined;
  currentRetry: number;
  err: object;
}

export async function runTester(tc: TesterContext, preset: Preset) {
  const { res, directory } = await isolate(tc);
  await placeTestFilesInCapsule(tc);
  await run();
  const results = await collectResults();
  if (!process.env.DEBUG_FLAG) {
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
