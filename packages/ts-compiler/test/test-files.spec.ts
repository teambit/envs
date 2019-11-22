import { buildComponentInWorkspace, getDefaultComponent } from './build-default-component';
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { GenericObject } from '../src/compiler';
import { buildOne } from 'bit-bin';
import { expect } from 'chai';
import compiler, { spy } from './spy-compiler';
import rimraf = require('rimraf');
import { SinonSandbox } from 'sinon';

describe('test files', function() {
  const helper = new Helper();
  let results: any = null;

  before(async function() {
    this.timeout(1000 * 60);
    const component: GenericObject = getDefaultComponent();
    component['test/test.spec.ts'] = '';

    results = await buildComponentInWorkspace(helper, {
      disableBuildStep: true,
      component,
      compilerPath: './dist/test/spy-compiler.js'
    });
    helper.command.runCmd('bit add -t test/test.spec.ts --id comp', results.directory);
  });
  after(async function() {
    return new Promise((resolve, reject) => rimraf(results.directory, {}, error => (error ? reject() : resolve())));
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
