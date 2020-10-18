import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { expect } from 'chai';
import rimraf = require('rimraf');
import { reactPreset } from '../src/react-native-preset';
import { buildComponentInWorkspace, BuildResult } from '@bit/bit.envs.common.build-component';
import { CardComponent } from './component-examples';

describe('react native typescript', () => {
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
      component: {
        'src/card.tsx': CardComponent,
      },
    });
  });
  after(async () => {
    if (results.directory) {
      return new Promise((resolve, reject) => rimraf(results.directory, {}, (error) => (error ? reject() : resolve())));
    }
  });
  it('build should pass', async () => {});
  it('should have correct dependencies', () => {
    const presetConfig = reactPreset.getDynamicPackageDependencies!();
    expect(results.showComponent.compilerPackageDependencies).to.deep.equal(presetConfig);
  });
});
