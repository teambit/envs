//@ts-ignore
import baseCompile from '@bit/bit.envs.internal.babel-base-compiler';
import Vinyl from 'vinyl';

const compiledFileTypes = ['js', 'jsx'];

const compile = (files: Vinyl[], distPath: string) => {
  return baseCompile(files, distPath, __dirname, compiledFileTypes);
};

export default {
  compile
};
