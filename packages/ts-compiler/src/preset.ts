import { GenericObject } from './compiler'

export type GenericStringObject = { [k: string]: string }

export type DependenciesJSON = {
  dependencies?: GenericStringObject
  devDependencies?: GenericStringObject
  peerDependencies?: GenericStringObject
}

export type CopyPolicy = {
  ignorePatterns: string[]
  disable: boolean
}

export interface Preset {
  getDynamicPackageDependencies?(): DependenciesJSON
  getDynamicConfig?(): GenericObject
  runCompiler?(): Promise<void>
  preCompile?(): Promise<void>
}

export const presetStore: { [k: string]: Preset } = {
  REACT: {
    getDynamicPackageDependencies() {
      return {
        devDependencies: {
          '@types/react': '16.9.11',
          '@types/react-dom': '16.9.4',
          '@bit/qballer.env.types': '0.0.2',
        },
        peerDependencies: {
          react: '^16.11.0',
          'react-dom': '^16.11.0',
        },
      }
    },

    getDynamicConfig() {
      return {
        tsconfig: {
          extends: '@bit/qballer.env.types/tsconfig.json',
          compilerOptions: {
            lib: ['dom', 'es2015'],
            jsx: 'react',
          },
          include: ['./**/*'],
        },
      }
    },
  },
  NONE: {},
}
