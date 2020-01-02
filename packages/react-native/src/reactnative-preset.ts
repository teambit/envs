import { Preset } from '@bit/bit.envs.common.preset';

export const reactNativePreset: Preset = {
  getDynamicPackageDependencies() {
    return {
      dependencies: {},
      devDependencies: {
        'metro-react-native-babel-preset': '^0.57.0'
      },
      peerDependencies: {
        react: '^16.9.0',
        'react-native': '^0.61.5'
      }
    };
  }
};
