import { createWorkspace } from '@bit/bit.envs.common.create-workspace';
import { getDefaultComponent } from '@bit/bit.envs.common.build-component';
import {} from 'bit-bin';
describe('Jest', function() {
  let directory = null;
  before(async function() {
    directory = await createWorkspace(getDefaultComponent(), {
      env: './dist/src/index',
      name: 'jest-tester'
    });
  });
  after(() => {});
  it('Should pass tests', () => {});
});
