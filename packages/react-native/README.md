# React Native Compiler

A ReactNative component compiler for [Bit](https://github.com/teambit/bit).
This compiler follows our best practices guide for compiling shared components.

## How to use?

In order to run this extension your must have a [bit workspace](https://docs.bit.dev/docs/concepts#bit-workspace) with at least one component defined, for more information on how to build please read the [docs](https://docs.bit.dev/docs/building-components) section on the bit website. TL;DR version:

Install the React Native compiler

```
$ bit import bit.envs/compilers/react-native -c
```

Then, you can simply build the component using `bit build`

```
$ bit build
```

## Features

- **Compile components in isolation** - Compiling shared components in true isolation is both challenging and important. It helps to find reusability issues quickly and early throughout the development process. It makes sure your components will compile identically anywhere and without side-effects. Read more about isolation [here](https://docs.bit.dev/docs/ext-concepts.html#what-is-an-isolated-component-environment).

- **Configuration** - This compiler is configured according to best practices for shared components compiling learned from our experience. For general concepts on how to approach shared components compilation and testing, please see the main [readme](https://github.com/teambit/envs). Feel free to open an issue or submit a PR if you think something should be different or there is a bug in the implementation.

## Configuration Reference

When first importing the compiler the bit entry in the package.json will look as following:

```js
{
    "bit": {
        "env": {
            "compiler": "bit.envs/compilers/react-native@[version]"
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
                "bit.envs/compilers/react-native@[version]": {
                    "rawConfig": {
                        "babelrc": {
                            "plugins": [],
                            "presets": []
                        },
                        "development": false,
                        "copyPolicy": {
                            "ignorePatterns": ["package.json", "package-lock.json", ".babelrc", "babel.config.js"],
                            "disable": false
                        }
                    }
                }
            }
        }
    }
}
```

- **babelrc** - override `.babelrc` configuration.
- **development** - enable or disable dev mode to include source maps and better debugging capabilities.
- **copyPolicy** - manage the copy policy.
- **copyPolicy.ignorePatterns** - Array of patterns to exclude files from being copied.
- **copyPolicy.disable** - turn off the copy policy.

## F.A.Q

#### What are my configuration ?

The default configuration without dev mode or overrides is [here](./config.md).

#### Whats to do component builds in workspace and doesn't build in capsule?

Most odds you missing a plugin or preset which influences the global scope.
Use the [Configuration Reference](#configuration-reference) to add it to the dependencies.
