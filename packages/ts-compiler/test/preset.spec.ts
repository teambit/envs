import { getTSConfig } from '../src/tsconfig';
import { expect } from 'chai';
import { typeScriptPreset } from '../src/typescript-preset';

describe('TypeScript Preset', function() {
  it('compilerPath needs to be returned from getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig() : {};
    expect(preset.compilerPath).to.equal('typescript/bin/tsc');
  });
});
