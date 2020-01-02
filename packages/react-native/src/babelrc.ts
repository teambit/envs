import { merge } from 'lodash';
import { GenericObject } from '@bit/bit.envs.common.compiler-types';

export const FIXED_OUT_DIR = 'dist';
export function getBabelrc(overrideConfig: GenericObject) {
  const defaultOptions = {
    presets: ['module:metro-react-native-babel-preset'],
    sourceMaps: 'inline',
    minified: false
  };

  const config = merge({}, defaultOptions, overrideConfig);

  return config;
}
