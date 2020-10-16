import { createWorkspace } from '@bit/bit.envs.common.create-workspace';
import { generateTypes } from '../src/generate-types';
import readdir from 'recursive-readdir';
import { expect } from 'chai';
import { getGenericStyle, getSVGType, getImageType } from '../src/generate-types';

describe('generate types', () => {
  it('should generate to svg, jpg, jpeg, webp, png, ico, gif, bmp files', async () => {
    const component = () => ({
      'src/svg-file.svg': '',
      'src/jpg-file.jpg': '',
      'src/jpeg-file.jpeg': '',
      'src/webp-file.webp': '',
      'src/png-file.png': '',
      'src/ico-file.ico': '',
      'src/gif-file.gif': '',
      'src/bmp-file.bmp': '',
    });
    const directory = await createWorkspace(component(), {
      env: '',
      name: 'test generate types',
    });
    await generateTypes(directory);
    const files = (await readdir(directory, ['.dependencies', 'dist', 'node_module']))
      .map((file) => file.split(`${directory}/`)[1])
      .filter((val) => val.endsWith('.d.ts'));
    Object.keys(component()).forEach((filePath) => {
      expect(!!~files.indexOf(`${filePath}.d.ts`), filePath).to.be.true;
    });
  });
  it('getGenericStyle declaration .d.ts file needs to start with "declare"', () => {
    expect(getGenericStyle().startsWith('declare'));
  });
  it('getImageType declaration .d.ts file needs to start with "declare"', () => {
    expect(getImageType().startsWith('declare'));
  });
  it('getSVGType declaration .d.ts file needs to include "declare"', () => {
    expect(getSVGType().includes('declare'));
  });
});
