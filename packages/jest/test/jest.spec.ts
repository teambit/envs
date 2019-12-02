import { createWorkspace } from '@bit/bit.envs.common.create-workspace';
import { getDefaultComponent, removeWorkspace, buildComponentInWorkspace } from '@bit/bit.envs.common.build-component';

import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
describe('Jest environment', function() {
  let directory: string | null = null;
  const helper = new Helper();
  before(async function() {
    this.timeout(1000 * 60 * 10);
    const component = getDefaultComponent();
    (component as any)['src/comp.spec.ts'] = '';
    const { directory } = await buildComponentInWorkspace(helper, {
      compilerPath: '../ts-compiler/dist/src',
      envTester: './dist/src',
      disableBuildStep: true,
      component
    });
    console.log('~!~', directory);
    helper.command.runCmd('bit add -t src/comp.spec.ts --id comp', directory);
    const output = helper.command.runCmd('node --inspect-brk $(which bit) test  comp --fork-level=NONE', directory);
    console.log(output);
  });
  after(async () => {
    if (!directory) {
      return;
    }
    // return removeWorkspace(directory)
  });
  it('Should pass tests', () => {});
});
