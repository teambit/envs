# Typescript Compiler

A TypeScript component compiler for [Bit](https://github.com/teambit/bit).
This compiler follows our best practices guide for compiling shared components.

## How to use?

In order to run this extension your must have a [bit workspace](https://docs.bit.dev/docs/concepts#bit-workspace) with at least one component defined, for more information on how to build please read the [docs](https://docs.bit.dev/docs/building-components) section on the bit website. TL;DR version:

Install the Typescript compiler

```
$ bit import -c bit.envs/compilers/typescript
```

Then, you can simply build the component using `bit build`

```
$ bit build
```

## Features

- **Type checking** - Uses the typescript compiler to perform type checking.

- **Compile components in isolation** - Compiling shared components in true isolation is both challenging and important. It helps to find reusability issues quickly and early throughout the development process. It makes sure your components will compile identically anywhere and without side-effects. Read more about isolation [here](https://docs.bit.dev/docs/ext-concepts.html#what-is-an-isolated-component-environment).

- **Styles and static file support** - When developing a UI component it can include more then just Typescript code. You may have images, svg files, css etc. Transpiling shared components without bundling can get complicated in both build time and runtime.

  - **Build time**: TypeScript type checker tries to resolve those files, to get the types information and fails. We resolve this issue by automatically providing type definitions for common imported files.
  - **Runtime**: Import statements may be broken in the target code, because the file system structure changed. To resolve that we employ a copy policy which copies the assets to the appropriate location in the target directory.

- **Configuration** - This compiler is configured according to best practices for shared components compiling learned from our experience. For general concepts on how to approach shared components compilation and testing, please see the main [readme](https://github.com/teambit/envs). Feel free to open an issue or submit a PR if you think something should be different or there is a bug in the implementation.

## Configuration Reference

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
                    "rawConfig": {
                        "compilerPath": "typescript/bin/tsc",
                        "compilerArguments": ["--declaration"],
                        "compiledFileTypes": [".ts", ".tsx"],
                        "configFileName": "tsconfig.json",
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
}
```

- **compilerPath** - set the path to the compiler.  
  E.g: for a Babel based compiler, it will be `@babel/cli/bin/babel`.
- **compilerArguments** - arguments options to run with the compiler.
- **compiledFileTypes** - file types to be compiled.
- **configFileName** - config file that the compiler should have.
  E.g: for a Babel based compiler, it will be `.babelrc`.
- **tsconfig** - override `tsconfig.json` configuration.
- **development** - enable or disable dev mode to include source maps and better debugging capabilities.
- **copyPolicy** - manage the copy policy.
- **copyPolicy.ignorePatterns** - Array of patterns to exclude files from being copied.
- **copyPolicy.disable** - turn off the copy policy.

## F.A.Q

#### What are my configuration ?

The default configuration without dev mode or overrides is [here](./config.md).

#### Whats to do component builds in workspace and doesn't build in capsule?

Most odds you missing a dependency which influences the global scope like `@types/node` or `@types/mocha`.
Use overrides to add it to the dependencies.

#### Missing types in consumer environment?

Some type dependency should be in th dependencies section and not in devDependencies. This is because
your component exposes a type from that dependency. In order for the consumer environment to get access to that type,
you must get when installing the component with NPM.

#### How to include custom-types folder from the author environment?

You have some custom-types folder which extend other types with your own type definition. You want to reuse it in capsule.
Do the following:

- create a component from the types.
- add it in overrides to all other components.
- include it in `tsconfig.include` as following:

```js
"bit.envs/compilers/typescript@[version]": {
    "rawConfig": {
        "tsconfig": {
            "compilerOptions": {},
            "include": [
                 "./**/*",
                 "node_modules/@bit/org.collection.custom-types"
            ]
        }
    }
}
```

#### Writing node only components and getting unknown identifer exception.

Add the flowing configuration override in the bit.json

```js
"bit.envs/compilers/typescript@[version]": {
    "rawConfig": {
        "tsconfig": {
            "compilerOptions": {
                "target": "ES5",
                "module": "CommonJS"
            }
        }
    }
}
```
