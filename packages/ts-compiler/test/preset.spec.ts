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
      ? typeScriptPreset.getDynamicConfig({ compiledFileTypes: ['.ts'] })
      : {};
    expect(preset.compiledFileTypes).to.eql(['.ts']);
  });
  it('should override compilerArguments in getDynamicConfig function', function() {
    const preset = typeScriptPreset.getDynamicConfig
      ? typeScriptPreset.getDynamicConfig({ compilerArguments: [] })
      : {};
    expect(preset.compilerArguments).to.eql([]);
  });
  it('should set development to true', function() {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig({ development: true }) : {};
    expect(preset.development).to.be.true;
  });
  it('should set development to false', function() {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig({ development: false }) : {};
    expect(preset.development).to.be.false;
  });
  it('should set development to false', function() {
    const preset = typeScriptPreset.getDynamicConfig ? typeScriptPreset.getDynamicConfig() : {};
    expect(preset.development).to.be.false;
  });
});
