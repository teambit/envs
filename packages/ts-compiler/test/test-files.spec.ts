import { buildComponentInWorkspace, getDefaultComponent, removeWorkspace } from '@bit/bit.envs.common.build-component';
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { GenericObject } from '@bit/bit.envs.common.compiler-types';
import { buildOne } from 'bit-bin';
import { expect } from 'chai';
import compiler from './spy-compiler';
import sinon from 'sinon';
import rimraf = require('rimraf');

describe('test files', function() {
  const helper = new Helper();
  let results: any = null;
  const spy = sinon.spy(compiler, 'action');

  before(async function() {
    this.timeout(1000 * 60);
    const component: GenericObject = getDefaultComponent();
    component['test/test.spec.ts'] = '';

    results = await buildComponentInWorkspace(helper, {
      disableBuildStep: true,
      component,
      compilerPath: './dist/test/spy-compiler.js'
    } as any);
    helper.command.runCmd('bit add -t test/test.spec.ts --id comp', results.directory);
  });
  after(async function() {
    spy.restore();
    return removeWorkspace(results.directory);
  });
  it('should mark as test dist file', async function() {
    this.timeout(1000 * 60 * 10);
    const cwd = process.cwd();

    const files = await buildOne('comp', false, false, results.directory);
    process.chdir(cwd);

    expect(spy === compiler.action).to.be.true;
    expect(spy.callCount).to.equal(1);
    const returnedTestFile = (await spy.returnValues[0]).dists.find((elem: any) => elem.basename === 'test.spec.js');
    expect(returnedTestFile!.test).to.be.true;
  });
});
