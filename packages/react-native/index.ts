//@ts-ignore
import baseCompile from '@bit/bit.envs.internal.babel-base-compiler';
import 'metro-react-native-babel-preset';
import Vinyl from 'vinyl';

const compiledFileTypes = ['js', 'jsx'];

const compile = (files: Vinyl[], distPath: string): void => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
};

export default {
  compile,
};
