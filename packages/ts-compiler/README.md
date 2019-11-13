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

- **Compile components in isolation** - Compiling shared components in true isolation is both challenging and important. It helps to find reusability issues quickly and early throughout the development process. It makes sure your components will compile identically anywhere and without side-effects. Read more about isolation [here](https://docs.bit.dev/docs/ext-concepts.html#what-is-an-isolated-component-environment). 

- **Styles and static file support** - When developing a UI component it can include more then just Typescript code. You may have images, svg files, css etc. Transpiling shared components without bundling can get complicated in regards to those assets in both build time and runtime. 
    * build time:  TypeScript type checker tries to resolve those files type information and fails. We resolve these issues by automatically providing type definitions for common imported files.
    * runtime: Import statements may be broken in the target code because the fs structure changed. To resolve that we employ a copy policy which copies the assets to the appropriate location in the target directory.

      
- **Configuration** - This compiler is configured according to best practices for shared components compiling learned from our experience. For general concepts on how to approach shared components compilation and testing, please see the main [readme](https://github.com/teambit/envs). Feel free to open an issue or submit a PR if you think something should be different or there is a bug in the implementation.

Configuration Reference
-------------------------
When first importing the compiler the bit entry in the package.json will look as following:

```js
{
    "bit": {
        "env": {
            "compiler": "bit.envs/compilers/typescript@[version]"
        }
    }
}
```
This config state is as if you would configure the compiler as following by hand: 

```js
{
    "bit": {
        "env": {
            "compiler": {
                "bit.envs/compilers/typescript@[version]": { 
                    "tsconfig": {},
                    "development": false
                    "copyPolicy": {
                        "ignorePatterns": ["package.json", "package-lock.json"], 
                        "disable": false
                    }
                }
            }
        }
    }
}
```
- **tsconfig** - override tsconfig.json configuration.
- **development** - enable or disable dev mode to include source maps and better debugging capabilities.
- **copyPolicy** - manage the copy policy.
- **copyPolicy.ignorePatterns** - Array of patterns to exclude files from being copied.
- **copyPolicy.disable** - turn off the copy policy.


