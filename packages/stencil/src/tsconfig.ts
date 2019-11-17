export default {
  compilerOptions: {
    allowSyntheticDefaultImports: true,
    allowUnreachableCode: false,
    declaration: false,
    experimentalDecorators: true,
    lib: ['dom', 'es2017'],
    moduleResolution: 'node',
    module: 'esnext',
    target: 'es2017',
    noUnusedLocals: true,
    noUnusedParameters: true,
    jsx: 'react',
    jsxFactory: 'h'
  },
  exclude: ['dist', '.dependencies', 'node_modules']
};
