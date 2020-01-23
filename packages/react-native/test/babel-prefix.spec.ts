import { expect } from 'chai';
import { babelPrefixResolve } from '../src/babelPrefixResolve';

describe('babelPrefixResolve', function() {
  it('should return correct package to install', function() {
    const dep = babelPrefixResolve('@babel/plugin-proposal-class-properties', 'plugin');
    expect(dep).to.equal('@babel/plugin-proposal-class-properties');
  });
  it('should return correct package to install', function() {
    const dep = babelPrefixResolve('transform-class-properties', 'plugin');
    expect(dep).to.equal('babel-plugin-transform-class-properties');
  });
  it('should return correct package to install', function() {
    const dep = babelPrefixResolve('module:metro-react-native-babel-preset', 'preset');
    expect(dep).to.equal('metro-react-native-babel-preset');
  });
  it('should return correct package to install', function() {
    const dep = babelPrefixResolve('@babel/preset-flow', 'preset');
    expect(dep).to.equal('@babel/preset-flow');
  });
});
