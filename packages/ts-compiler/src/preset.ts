import { GenericObject } from "./compiler"

export type GenericStringObject = {[k:string]:string}
 
export type DependenciesJSON = {
    dependencies?: GenericStringObject,
    devDependencies?: GenericStringObject,
    peerDependencies?: GenericStringObject
}

export type CopyPolicy = {
    ignorePatterns: string[],
    disable: boolean
}

export interface Preset { 
    getDynamicPackageDependencies?(): DependenciesJSON,
    getDynamicConfig?(): GenericObject
    runCompiler?(): Promise<void>,
    preCompile?(): Promise<void>,
}

export const presetStore:{[k:string]:Preset} = {
    REACT: {
        getDynamicPackageDependencies(){
            return {
                devDependencies: {
                    "@types/react": "16.9.11",
                    "@types/react-dom": "16.9.4",
                    '@bit/qballer.react-scripts.types-env': '0.0.2'
                },
                peerDependencies: {
                    "react": "^16.11.0",
                    "react-dom": "^16.11.0",
                }
            }
        }, 
        getDynamicConfig(){
            return {
                tsconfig: {
                    lib: [
                        "dom",
                        "es2015"
                    ],
                    jsx: 'react',
                    typeRoots: [
                        "./node_modules/@types", // be able to consume @types.
                        "./node_modules/@bit/qballer.react-scripts.types-env" // lookup custom types provided by compiler.
                    ],
                }
            }
        }
    },
    NONE: {}
}