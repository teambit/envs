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

- **Styles and static file support** - When developing a UI component it can include more then just Typescript code. You may have images, svg files, css and more. Those assets may also be referenced by import statements from the component logic. When that happens target code will not have the correct path for them. The typescript compiler doesn't handle those type of files directly. 

Transpiling shared components without bundling can get complicated as the TypeScript type checker tries and fails to resolve static assets and css files included in import statements in the component. We resolve these issues by automatically providing type definitions for common imported files.
      
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
**tsconfig** - override tsconfig.json configuration.
**development** - enable or disable dev mode to include source maps and better debugging capabilities.
**copyPolicy** - manage the copy policy.
**copyPolicy.ignorePatterns** - Array of pattern to exclude files from being copied.
**copyPolicy.disable** - turn off the copy policy.


