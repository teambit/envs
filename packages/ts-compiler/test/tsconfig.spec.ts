import { getTSConfig } from '../src/tsconfig';
import { expect } from 'chai';
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import { createWorkspace } from '@bit/bit.envs.common.create-workspace';
import compiler from '../src';
import sinon from 'sinon';
import { removeWorkspace } from '@bit/bit.envs.common.build-component';
import { collectDistFiles, findMainFile } from '../src/compile';

describe('Side effects', function() {
  it('tsconfig out dir can not be changed', function() {
    const config = getTSConfig(true, { compilerOptions: { outDir: 'other' } });
    expect(config.compilerOptions.outDir).to.equal('dist');
  });
  it('should find mainDistFile', async function() {
    this.timeout(1000 * 60 * 10);
    const helper = new Helper();
    const directory = await createWorkspace(
      {
        'src/Focus/index.ts': `
        export function print(msg:string) {
          console.log(msg)
        }
      `,
        'src/TrapFocus/index.ts': `
      import {print} from '../Focus';
      `
      },
      {
        env: 'dist/src/index.js',
        name: 'MainDistFile'
      }
    );
    helper.scopeHelper.initWorkspace(directory);
    helper.command.runCmd('bit add src/Focus/index.ts --id focus', directory);
    helper.command.runCmd('bit add src/TrapFocus/index.ts --id trap-focus', directory);
    helper.command.runCmd('bit build trap-focus', directory);
    const files = await collectDistFiles({ directory, srcTestFiles: [] } as any);
    const testFiles = [];
    const main = findMainFile({ directory, main: 'TrapFocus/index.ts' } as any, files);
    console.log('main', main);
    expect(main).to.equal('TrapFocus/index.js');
    await removeWorkspace(directory);
  });
});
