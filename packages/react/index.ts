import '@babel/preset-env';
import '@babel/preset-react';
import '@babel/plugin-proposal-class-properties';
import '@babel/plugin-proposal-export-default-from';
import '@babel/plugin-proposal-export-namespace-from';
import '@babel/plugin-proposal-object-rest-spread';
import '@babel/plugin-proposal-optional-chaining';
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
