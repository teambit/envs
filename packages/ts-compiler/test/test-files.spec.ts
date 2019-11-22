import { buildComponentInWorkspace, defaultComponent } from './build-default-component';
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { GenericObject } from '../src/compiler';
import { buildOne } from 'bit-bin';
import { expect } from 'chai';

describe.skip('test files', function() {
  const helper = new Helper();
  let results: any = null;
  before(async function() {
    this.timeout(1000 * 60);
    const component: GenericObject = { ...defaultComponent };
    component['test/test.spec.ts'] = '';

    results = await buildComponentInWorkspace(helper, {
      disableBuildStep: true,
      component,
      compilerPath: './dist/test/spy-compiler.js'
    });
    helper.command.runCmd('bit add -t test/test.spec.ts --id comp', results.directory);
  });
  it('should mark as test dist file', async function() {
    this.timeout(1000 * 60 * 10);
    const files = await buildOne('comp', false, false, results.directory);
    console.log('files:', files);
    const spy = require('./spy-compiler').spy;
    const compiler = require('./spy-compiler').default;
    expect(spy === compiler.action).to.be.true;
    expect(spy.callCount).to.equal(1);
  });
});
