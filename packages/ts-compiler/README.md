Typescript
==========

Typescript support for bit components.

How to use?
-----------

In order to run this extension your must have a bit workspace with at least one component defined, for more information on how to build please read the [docs](https://docs.bit.dev/docs/building-components) section on the bit website. TL;DR version: 

1. ```bit import -c bit.envs/compilers/typescript``` to install the extension.
2. ```bit build``` - to build the component

What inside? 
--------------

1. **Typescript** - Uses the typescript compiler to perform [transpilation](https://en.wikipedia.org/wiki/Source-to-source_compiler) and type checking.
   
2. **Isolation**  - The component is isolated from the workspace for compilation. This is done because while compiling typescript code, the compiler traverses it's import statements in order to resolve types and transpile from dependencies. By using isolating the component we make sure that it will only compile the source code of a single component. We also make sure we have all correct dependencies and that it doesn't depend on anything implicit. Read more about [isolation](https://docs.bit.dev/docs/ext-concepts.html#what-is-an-isolated-component-environment) here. 
   
3. **Static Assets** - For re-useability purposes non typescript files of the component would be copied to the dist folder. One of the main reasons this is done is to support different style files that should be compiled while consuming the component. This is also applied to all other static assets (fonts, images etc.). By default the compiler ignores. You can provide the following configuration to ignoreFiles
   ```json
   {
        "env": {
            "bit.envs/compilers/typescript@(some-version)": { 
                "rawConfig": {
                    "ignoreFiles": ["package.json", "package-lock.json"],
                     // this is default. 
                }
            }
        }
       
   }
   ```
      
4. **Configuration** - Currently configuration is predefined in a preset. In order to change configuration you will need override it using. If you would like understand why a specific configuration was applied read [here](https://tbd). 
 
5. **Styling support** - Import statements of style files must include the type definition of that file, else the type checker fails. The compiler adds the ```@bit/bit.envs.types``` component to the devDependencies and the typesRoots compiler option. This can be changed via overrides if needed. 