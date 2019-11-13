export type GenericStringObject = {[k:string]:string}
 
export type DependenciesJSON = {
    dependencies?: GenericStringObject,
    devDependencies?: GenericStringObject,
    peerDependencies?: GenericStringObject
}

export type CopyPolicy = {
    ignorePatterns: string[],
    enable: boolean
}

export interface Preset { 
    getDynamicPackageDependencies?(): DependenciesJSON,
    getCopyPolicy?(): CopyPolicy
}

export const presetStore:{[k:string]:Preset} = {
    REACT: {
        getDynamicPackageDependencies(){
            return {
                devDependencies: {
                    "@types/react": "16.9.11",
                    "@types/react-dom": "16.9.4",
                    '@bit/qballer.react-scripts.types-env': '0.0.1'
                },
                peerDependencies: {
                    "react": "^16.11.0",
                    "react-dom": "^16.11.0",
                }
            }
        }
    },
    NONE: {}
}