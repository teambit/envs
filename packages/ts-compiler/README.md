Typescript Compiler
=================

A TypeScript component compiler for [Bit](https://github.com/teambit/bit). This compiler follows our Best Practices guide for compiling shared components.

How to use?
-----------

In order to run this extension your must have a [bit workspace](https://docs.bit.dev/docs/concepts#bit-workspace) with at least one component defined, for more information on how to build please read the [docs](https://docs.bit.dev/docs/building-components) section on the bit website. TL;DR version: 

Install the Typescript compiler
```
$ bit import -c bit.envs/compilers/typescript
```

Then, you can simply build the component using `bit build`
```
$ bit build
```

Features
-----------

- **Type checking** - Uses the typescript compiler to perform type checking.

- **Compile components in true isolation** - Compiling shared components in true isolation is both challenging and important. It helps to find reusability issues quickly and early throughout the development process and make sure your components will compile identiticly anywhere and without side-effects or irrelevant code for the component. Read more about isolation [here](https://docs.bit.dev/docs/ext-concepts.html#what-is-an-isolated-component-environment). 

- **Copy policy** - For reusability purposes non-TypeScript files of the component would be copied to the dist folder. One of the main reasons this is done is to support different style files that should be compiled while consuming the component. This is also applied to all other static assets (e.g. .gif file). By default the compiler ignores ```package.json``` and ```package-lock.json``` files. You may customize the ignorePatterns and feature as following. 
   ```js
   {
        "bit": {
            "env": {
                "bit.envs/compilers/typescript@(some-version)": { 
                    "rawConfig": {
                        // these are the default values, no need to configure them. 
                        "copyPolicy": {
                            "ignorePatterns": ["package.json", "package-lock.json"],
                            "enable": true // should copyPolicy run
                        } 
                    }
                }
            }
        } 
   }
   ```
      
- **Configuration** - This compiler is configurued according to best practices for shared component compiling learned from our experience. For general concepts re how to approach shared components compiling and bundling, please see X.

Currently configuration is predefined in a preset. In order to change configuration you will need override it using the bit entry in the package.json. You may override compilerOptions and other configuration using the following config for example: 
```js
{
   "bit":{
      "env":{
         "bit.envs/compilers/typescript":{
            "tsconfig":{
               "compilerOptions":{
                  "typesRoots":[
                     "./node_modules/@types"
                  ]
               }
            }
         }
      }
   }
}
```
The configuration detailed in the [tsconfig.ts](https://github.com/teambit/envs/blob/master/packages/ts-compiler/src/tsconfig.ts) file. The configs are chosen because we believe they are best for transpiling reusable components. Please open an issue if you feel it should be different or there is a bug in implementation. 

Here are the full configuration options, by default you don't need to configure any of them. 
```js
   {
       "bit": {
            "env": {
                "bit.envs/compilers/typescript@(some-version)": { 
                    "rawConfig": {
                        "tsconfig":{ /** override tsconfig **/},
                        "preset" : "react" || "none", // for predefined flavor of configuration
                        "development": true || false, // change mode for development for debugging and testing
                        "copyPolicy": {
                            "ignorePatterns": ["package.json", "package-lock.json"], // pattens to help ignore coping files
                            "enable": true || false// should copyPolicy run
                        }
                }
            }
       }
   }
```

- **Styles and static file support** - Traspiling shared components without bundling can get complicated as the TypeScript tries and fails to resolve static assets and css files included in import statements in the component. We resolve this issues by automatically generating type definition files for common imported files. How to use? How to ignore?


Configuration Reference
-------



