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
// preset- done 
// handle type generation - 
// handle test attribute -
// handle configuration override - done
/***
 *  describing product- done
 e2e
 preset - done
 configuration merging -done
 copy policy - done
 testing.
 react/none preset. done  
 type definition. - done
 Fix issue #10
 */
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
                    jsx: 'react'
                }
            }
        }
    },
    NONE: {}
}