import { expect } from 'chai';
import { typeScriptPreset } from '../src/typescript-preset';

describe('TypeScript Preset', function() {
  it('should return getDynamicConfig function from TypeScript Preset', function() {
    const preset = typeScriptPreset.getDynamicConfig;
    expect(preset).to.exist;
  });
  it('should return compilerPath from getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig() : {};
    expect(preset.compilerPath).to.equal('typescript/bin/tsc');
  });
  it('should return configFileName from getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig() : {};
    expect(preset.configFileName).to.equal('tsconfig.json');
  });
  it('should override compiledFileTypes in getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig
      ? //@ts-ignore
        typeScriptPreset.getDynamicConfig({ compiledFileTypes: ['.ts'] })
      : {};
    expect(preset.compiledFileTypes).to.eql(['.ts']);
  });
  it('should override compilerArguments in getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig
      ? //@ts-ignore
        typeScriptPreset.getDynamicConfig({ compilerArguments: [] })
      : {};
    expect(preset.compilerArguments).to.eql([]);
  });
});
