export function getTSConfig() {
  const isDev = process.env['NODE_ENV'] == 'development'
  return {
    compilerOptions: {
      target: isDev ? 'ES2017': 'ES6',
      // ES6 For production to accommodate old browsers/node. ES2017 to provide better debugging in development.
      sourceMap: isDev,
      // Only on dev mode.
      moduleResolution: 'Node',
      // Classic isn't relevant for new code created. 
      esModuleInterop: true,
      // Allow es6 modules and commonjs to work together.   
      module: 'commonjs',
      // Sensible default, should consider ESM when node it will be default in node.
      allowSyntheticDefaultImports: true,
      resolveJsonModule: true,
      declaration: true,
      // for type reusing. 
      experimentalDecorators: true,
      // support decorator syntax
      inlineSourceMap: isDev,
      inlineSources: isDev,
      // should not clutter dist folder
      jsx: 'react',
      rootDir: './',
      // the root of the capsule is CWD when transpiling and should be rootDir.
      removeComments: !isDev,
      typeRoots: [
        "./node_modules/@types", // be able to consume types.
        "./node_modules/@bit/qballer.react-scripts.types-env" // lookup custom types provided by compiler.
      ],
      importHelpers: false,
      // bundle size in component would be better if we don't depend on tslib
    }
  }
}
