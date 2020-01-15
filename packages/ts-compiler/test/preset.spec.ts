import { expect } from 'chai';
import { typeScriptPreset } from '../src/typescript-preset';

describe('TypeScript Preset', function() {
  it('compilerPath needs to be returned from getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig
      ? typeScriptPreset.getDynamicConfig({ development: false, tsconfig: {} } as any)
      : {};
    expect(preset.compilerPath).to.equal('typescript/bin/tsc');
  });
  it('configFileName needs to be returned from getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig
      ? typeScriptPreset.getDynamicConfig({ development: false, tsconfig: {} } as any)
      : {};
    expect(preset.configFileName).to.equal('tsconfig.json');
  });
});
