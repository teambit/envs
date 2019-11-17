import { Preset } from "./preset";
import { GenericObject } from "./compiler";
import { merge } from "lodash";

export function getTSConfig(isDev:boolean, overrideConfig:GenericObject) {
  const defaultOptions = {
    compilerOptions: {
      // ES6 For production to accommodate old browsers/node. ES2017 to provide better debugging in development.
      target: isDev ? 'ES2017': 'ES2015',
      // Only on dev mode.
      sourceMap: isDev,
      // Classic isn't relevant for new code created.
      moduleResolution: 'Node',
      // Allow es6 modules and commonjs to work together. 
      esModuleInterop: true,
      module: 'ES6',
      allowSyntheticDefaultImports: true,
      resolveJsonModule: true,
      // for type reusing. 
      declaration: true,
      experimentalDecorators: true,
      // inline sources and source-maps so it won't clutter dist folder
      inlineSourceMap: isDev,
      inlineSources: isDev,
      jsx: 'react',
      // the root of the capsule is CWD when transpiling and should be rootDir to adjust library sturcture.
      rootDir: './',
      removeComments: !isDev,
      typeRoots: [
        "./node_modules/@types", // be able to consume @types.
      ],
      // bundle size in component would be better if we don't depend on tslib.
      importHelpers: false,
    },
    include: ['./**/*'],
    exclude: ['node_modules', '.dependencies', 'dist']
  }
  return merge({}, defaultOptions, overrideConfig )
}

/*
export default {
  "compilerOptions": {
      "target": "es2015",
      "skipLibCheck": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "strict": false,
      "forceConsistentCasingInFileNames": true,
      "module": "CommonJS",
      "sourceMap": true,
      "moduleResolution": "Node",
      "resolveJsonModule": true,
      "isolatedModules": false,
      "declaration": false,
      "experimentalDecorators": true,
      "jsx": "react",
      "rootDir": './'
  }
}
*/