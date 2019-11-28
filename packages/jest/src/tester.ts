import { TesterContext } from './tester-types';
import { Preset } from '@bit/bit.envs.common.preset';
import { isolate } from '@bit/bit.envs.common.isolate';
export interface TestResult {
  title: string;
  fullTitle: string;
  duration: number | undefined;
  currentRetry: number;
  err: object;
}

export async function compile(tc: TesterContext, preset: Preset) {
  const { res, directory } = await isolate(tc);
  placeTestFilesInCapsule(tc);
}

function placeTestFilesInCapsule(tc: TesterContext) {}
