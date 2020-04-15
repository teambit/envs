import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { expect } from 'chai';
import rimraf = require('rimraf');
import { buildComponentInWorkspace, BuildResult } from '@bit/bit.envs.common.build-component';
import { NormalButtonComponent, CardComponent, InputComponent } from './component-examples';

describe('babel react-native', () => {
  const helper = new Helper();
  let results: BuildResult = {
    directory: '',
    files: [],
    showComponent: {},
  };
  before(async function () {
    this.timeout(1000 * 10 * 10);
    results = await buildComponentInWorkspace(helper, {
      compilerPath: 'dist/src/index.js',
      envTester: 'dist/src/index.js',
      component: {
        'src/comp.js': NormalButtonComponent,
        'src/comp2.jsx': NormalButtonComponent,
        'src/card.js': CardComponent,
        'src/input.js': InputComponent,
        'src/func.js': '',
        'src/test.css': '',
        'src/try.svg': '',
      },
    });
  });
  after(async function () {
    if (results.directory) {
      return new Promise((resolve, reject) => rimraf(results.directory, {}, (error) => (error ? reject() : resolve())));
    }
  });
  it('build should pass', async function () {});
});
