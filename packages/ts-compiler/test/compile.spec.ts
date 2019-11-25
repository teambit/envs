import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { expect } from 'chai';
import rimraf from 'rimraf';
import { BuildResult, buildComponentInWorkspace } from '@bit/bit.envs.common.build-component';

describe('typescript', () => {
  const helper = new Helper();
  let results: BuildResult = {
    directory: '',
    files: [],
    showComponent: {}
  };
  before(async function() {
    this.timeout(1000 * 10 * 10);
    results = await buildComponentInWorkspace(helper);
  });
  after(async () => {
    return new Promise((resolve, reject) => rimraf(results.directory, {}, error => (error ? reject() : resolve())));
  });
  it('build should pass', async () => {});
  it('build should exclude default ignore patterns', async () => {
    expect(results.files.indexOf('package.json')).to.equal(-1);
    expect(results.files.indexOf('tsconfig.json')).to.equal(-1);
  });
  it('should have a declaration file', () => {
    expect(!!~results.files.indexOf('comp.d.ts')).to.be.true;
  });
  it('should copy non dist files', () => {
    expect(!!~results.files.indexOf('test.css')).to.be.true;
    expect(!!~results.files.indexOf('types.d.ts')).to.be.true;
    expect(!!~results.files.indexOf('try.svg')).to.be.true;
  });
});
