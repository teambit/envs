import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { expect } from 'chai';
import rimraf = require('rimraf');
import sinon, { SinonSandbox } from 'sinon';
import { presetStore } from '../src/preset';
import { buildComponentInWorkspace, BuildResult } from './build-default-component';

describe('typescript react', () => {
  const helper = new Helper();
  let results: BuildResult = {
    directory: '',
    files: [],
    showComponent: {}
  };
  before(async function() {
    this.timeout(1000 * 10 * 10);
    results = await buildComponentInWorkspace(helper, { compilerPath: 'dist/test/typescript-react.js' });
  });
  after(async function() {
    return new Promise((resolve, reject) => rimraf(results.directory, {}, error => (error ? reject() : resolve())));
  });
  it('build should pass', async function() {});
  it('should have correct dependencies', function() {
    const presetConfig = presetStore.REACT.getDynamicPackageDependencies!();
    expect(results.showComponent.compilerPackageDependencies).to.deep.equal(presetConfig);
  });
});
