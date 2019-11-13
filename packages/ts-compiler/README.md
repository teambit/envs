Typescript
==========

A TypeScript compiler for Bit components.

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

1. **Typescript** - Uses the typescript compiler to perform [transpilation](https://en.wikipedia.org/wiki/Source-to-source_compiler) and type checking.
   
2. **Isolation**  - The component is isolated from the workspace for compilation. This is done because while compiling typescript code, the compiler traverses it's import statements in order to resolve types and transpile modules. By isolating the component we make sure that it will only compile the source code of a single component (assuming dependencies are already compiled). We also make sure we have all correct dependencies and that it doesn't depend on anything implicit. Read more about isolation [here](https://docs.bit.dev/docs/ext-concepts.html#what-is-an-isolated-component-environment). 

3. **Copy Policy** - For re-useability purposes non typescript files of the component would be copied to the dist folder. One of the main reasons this is done is to support different style files that should be compiled while consuming the component. This is also applied to all other static assets (e.g. .gif file). By default the compiler ignores ```package.json``` and ```package-lock.json``` files. You may customize the ignorePatterns and feature as following. 
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
      
4. **Configuration** - Currently configuration is predefined in a preset. In order to change configuration you will need override it using the bit entry in the package.json. You may override compilerOptions and other configuration using the following config for example: 
```js
   {
       "bit": {
            "env": {
                "bit.envs/compilers/typescript@(some-version)": { 
                    "rawConfig": {
                        "tsconfig":{ 
                            "compilerOptions": {
                                "typesRoots": ["./node_modules/@types"]
                            }
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

5. **Styling support** - Import statements of style files must include the type definition of that file, else the type checker fails. The compiler adds the 
6. ```@bit/qballer.react-scripts.types-env``` component to the devDependencies and the typesRoots compiler option. This can be changed via overrides if needed. Remove the devDependency using the "-" override like described in the [guide](https://docs.bit.dev/docs/overrides#components-dependencies). You may also remove the type lookup from typesRoots as in the example of section 4. 



