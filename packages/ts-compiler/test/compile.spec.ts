import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { expect } from 'chai';
import rimraf from 'rimraf';
import Vinyl from 'vinyl';
import { BuildResult, buildComponentInWorkspace, removeWorkspace } from '@bit/bit.envs.common.build-component';
import { createWorkspace } from '@bit/bit.envs.common.create-workspace';
import { getNonCompiledFiles } from '../src/compile';
import { typeScriptPreset } from '../src/typescript-preset';

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
    return removeWorkspace(results.directory);
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
  it('should get non compiled files', () => {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig() : {};
    const compiledFileTypes: Array<string> = preset.compiledFileTypes;
    const filesPath = [
      'src/Focus/print.ts',
      'src/Focus/index.tsx',
      'src/Focus/profile.svg',
      'src/Focus/profile-png.png',
      'src/Focus/my-style.css'
    ];
    const files = filesPath.map(path => {
      return new Vinyl({ path });
    });
    const nonCompiledFiles = getNonCompiledFiles(files, compiledFileTypes);
    expect(nonCompiledFiles.length).to.equal(3);
    expect(nonCompiledFiles[0].extname).to.equal('.svg');
    expect(nonCompiledFiles[1].extname).to.equal('.png');
    expect(nonCompiledFiles[2].extname).to.equal('.css');
  });
});
