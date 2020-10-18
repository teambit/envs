import { expect } from 'chai';
import { reactPreset } from '../src/react-native-preset';

describe('React Native TypeScript Preset', () => {
  it('should return getDynamicConfig function from React Native TypeScript Preset', () => {
    const preset = reactPreset.getDynamicConfig;
    expect(preset).to.exist;
  });
  it('should return compilerPath from getDynamicConfig function', () => {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig() : {};
    expect(preset.compilerPath).to.equal('typescript/bin/tsc');
  });
  it('should return configFileName from getDynamicConfig function', () => {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig() : {};
    expect(preset.configFileName).to.equal('tsconfig.json');
  });
  it('should override compiledFileTypes in getDynamicConfig function', () => {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig({ compiledFileTypes: ['.tsx'] }) : {};
    expect(preset.compiledFileTypes).to.eql(['.tsx']);
  });
  it('should override compilerArguments in getDynamicConfig function', () => {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig({ compilerArguments: [] }) : {};
    expect(preset.compilerArguments).to.eql([]);
  });
  it('should set development to true', () => {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig({ development: true }) : {};
    expect(preset.development).to.be.true;
  });
  it('should set development to false', () => {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig({ development: false }) : {};
    expect(preset.development).to.be.false;
  });
  it('should set development to true', () => {
    const preset = reactPreset.getDynamicConfig ? reactPreset.getDynamicConfig() : {};
    expect(preset.development).to.be.true;
  });
});
