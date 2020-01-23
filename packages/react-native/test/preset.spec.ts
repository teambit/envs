import { expect } from 'chai';
import { reactNativePreset } from '../src/reactnative-preset';

describe('ReactNative Preset', function() {
  it('should return getDynamicPackageDependencies function from ReactNative Preset', function() {
    const preset = reactNativePreset.getDynamicPackageDependencies;
    expect(preset).to.exist;
  });
  it('should return getDynamicConfig function from ReactNative Preset', function() {
    const preset = reactNativePreset.getDynamicConfig;
    expect(preset).to.exist;
  });
  it('should return compilerPath from getDynamicConfig function', function() {
    const preset = reactNativePreset.getDynamicConfig ? reactNativePreset.getDynamicConfig() : {};
    expect(preset.compilerPath).to.equal('@babel/cli/bin/babel');
  });
  it('should return configFileName from getDynamicConfig function', function() {
    const preset = reactNativePreset.getDynamicConfig ? reactNativePreset.getDynamicConfig() : {};
    expect(preset.configFileName).to.equal('babel.config.json');
  });
  it('should override compiledFileTypes in getDynamicConfig function', function() {
    const preset = reactNativePreset.getDynamicConfig
      ? reactNativePreset.getDynamicConfig({ compiledFileTypes: ['.js', '.jsx'] })
      : {};
    expect(preset.compiledFileTypes).to.eql(['.js', '.jsx']);
  });
  it('should override compilerArguments in getDynamicConfig function', function() {
    const preset = reactNativePreset.getDynamicConfig
      ? reactNativePreset.getDynamicConfig({ compilerArguments: ['./**/*'] })
      : {};
    expect(preset.compilerArguments).to.eql(['./**/*']);
  });
});
