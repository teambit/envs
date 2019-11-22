import { getTSConfig } from '../src/tsconfig';
import { exportAllDeclaration } from '@babel/types';
import { expect } from 'chai';
import { buildOne } from 'bit-bin';
import { buildComponentInWorkspace } from './build-default-component';
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';

describe('tsconfig', function() {
  it('out dir can not be changed', function() {
    const config = getTSConfig(true, { compilerOptions: { outDir: 'other' } });
    expect(config.compilerOptions.outDir).to.equal('dist');
  });
});
