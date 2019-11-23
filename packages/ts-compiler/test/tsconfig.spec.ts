import { getTSConfig } from '../src/tsconfig';
import { expect } from 'chai';

describe('tsconfig', function() {
  it('out dir can not be changed', function() {
    const config = getTSConfig(true, { compilerOptions: { outDir: 'other' } });
    expect(config.compilerOptions.outDir).to.equal('dist');
  });
});
