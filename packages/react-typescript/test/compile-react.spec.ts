import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { expect } from 'chai';
import rimraf = require('rimraf');
import { reactPreset } from '../src/react-preset';
import { buildComponentInWorkspace, BuildResult } from '@bit/bit.envs.common.build-component';

describe('typescript react', () => {
  const helper = new Helper();
  let results: BuildResult = {
    directory: '',
    files: [],
    showComponent: {},
  };
  before(async function () {
    this.timeout(1000 * 10 * 10);
    // @ts-ignore
    results = await buildComponentInWorkspace(helper, {
      compilerPath: 'dist/src/index.js',
      envTester: 'dist/src/index.js',
    });
  });
  after(async function () {
    if (results.directory) {
      return new Promise((resolve, reject) => rimraf(results.directory, {}, (error) => (error ? reject() : resolve())));
    }
  });
  it('build should pass', async function () {});
  it('should have correct dependencies', function () {
    const presetConfig = reactPreset.getDynamicPackageDependencies!();
    expect(results.showComponent.compilerPackageDependencies).to.deep.equal(presetConfig);
  });
});
