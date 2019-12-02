import { createWorkspace } from '@bit/bit.envs.common.create-workspace';
import { getDefaultComponent, removeWorkspace, buildComponentInWorkspace } from '@bit/bit.envs.common.build-component';

import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
describe('Jest environment', function() {
  let directory: string | null = null;
  const helper = new Helper();
  before(async function() {
    this.timeout(1000 * 10);
    const component = getDefaultComponent();
    component['test/firs.spec.ts'] = '';
    buildComponentInWorkspace(helper, {
      disableBuildStep: true,
      component
    });
    directory = await createWorkspace(component, {
      env: './dist/src/index',
      name: 'jest-tester'
    });
  });
  after(async () => {
    if (!directory) {
      return;
    }
    console.log(directory);
    // return removeWorkspace(directory)
  });
  it('Should pass tests', () => {});
});
