import { expect } from 'chai';
import { reactPreset } from '../src/react-preset';

describe('TypeScript Preset', function() {
  it('should return getDynamicConfig function from React-TypeScript Preset', function() {
    const preset = reactPreset.getDynamicConfig;
    expect(preset).to.exist;
  });
  it('should return compilerPath from getDynamicConfig function', function() {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig() : {};
    expect(preset.compilerPath).to.equal('typescript/bin/tsc');
  });
  it('should return configFileName from getDynamicConfig function', function() {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig() : {};
    expect(preset.configFileName).to.equal('tsconfig.json');
  });
  it('should override compiledFileTypes in getDynamicConfig function', function() {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig({ compiledFileTypes: ['.tsx'] }) : {};
    expect(preset.compiledFileTypes).to.eql(['.tsx']);
  });
  it('should override compilerArguments in getDynamicConfig function', function() {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig({ compilerArguments: [] }) : {};
    expect(preset.compilerArguments).to.eql([]);
  });
});
