import { expect } from 'chai';
import { typeScriptPreset } from '../src/typescript-preset';

describe.only('TypeScript Preset', function() {
  it('getDynamicConfig function needs to be returned from TypeScript Preset', function() {
    const preset = typeScriptPreset.getDynamicConfig;
    expect(preset).to.exist;
  });
  it('compilerPath needs to be returned from getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig() : {};
    expect(preset.compilerPath).to.equal('typescript/bin/tsc');
  });
  it('configFileName needs to be returned from getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig() : {};
    expect(preset.configFileName).to.equal('tsconfig.json');
  });
});
