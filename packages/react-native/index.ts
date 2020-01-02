import { ReactNativeCompiler } from './src/reactnative-compiler';
import { reactNativePreset } from './src/reactnative-preset';

export default new ReactNativeCompiler(reactNativePreset);

/**
 *
 * send configuration of babelrc with rawConfig,
 * check that is writed in the babelrc inside the capsule
 *
 * check plugin/preset are linked in bit show with the right name
 */
