import 'metro-react-native-babel-preset';
import Vinyl from 'vinyl';

const baseCompile = require('@bit/bit.envs.internal.babel-base-compiler');
const compiledFileTypes = ['js'];

const compile = (files: Vinyl[], distPath: string) => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
};

export default {
  compile
};
