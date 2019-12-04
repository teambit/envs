import { createWorkspace } from '@bit/bit.envs.common.create-workspace';
import { generateTypes } from '../src/generate-types';
import readdir from 'recursive-readdir';
import { expect } from 'chai';

describe('generate types', function() {
  it('should generate to css files', async function() {
    const component = () => ({
      'src/index.css': '',
      'index.css': '',
      'src/yo.jpg': ''
    });
    const directory = await createWorkspace(component(), {
      env: '',
      name: 'test generate types'
    });
    await generateTypes(directory);
    const files = (await readdir(directory, ['.dependencies', 'dist', 'node_module']))
      .map(file => file.split(`${directory}/`)[1])
      .filter(val => val.endsWith('.d.ts'));
    Object.keys(component()).forEach(function(filePath) {
      expect(!!~files.indexOf(`${filePath}.d.ts`), filePath).to.be.true;
    });
  });
});
