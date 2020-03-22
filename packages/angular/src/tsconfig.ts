export const TSConfig = {
  compilerOptions: {
    target: 'es2015',
    module: 'es2015',
    strict: true,
    declaration: true,
    jsx: 'preserve',
    importHelpers: true,
    moduleResolution: 'node',
    experimentalDecorators: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    preserveSymlinks: true,
    emitDecoratorMetadata: true,
    skipLibCheck: true,
    allowJs: true,
    sourceMap: true,
    inlineSourceMap: true,
    inlineSources: true,
    baseUrl: '.',
    paths: {
      '@/*': ['src/*'],
      '~/*': ['./*']
    },
    lib: ['esnext', 'dom', 'dom.iterable', 'scripthost', 'es2018']
  },
  angularCompilerOptions: {
    annotateForClosureCompiler: true,
    skipTemplateCodegen: true,
    strictMetadataEmit: false,
    fullTemplateTypeCheck: false,
    enableResourceInlining: true,
    enableIvy: false
  },
  exclude: ['node_modules', '.bit']
};
