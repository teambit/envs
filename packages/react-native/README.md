# React-Native compiler

A React-Native component compiler for [Bit](https://github.com/teambit/bit).
The compiler is also heavily based on [typescript](https://github.com/teambit/envs/blob/master/packages/ts-compiler/README.md) compiler.

## How to use?

In order to run this extension your must have a [bit workspace](https://docs.bit.dev/docs/concepts#bit-workspace) with at least one component defined, for more information on how to build please read the [docs](https://docs.bit.dev/docs/building-components) section on the bit website. TL;DR version:

Install the React-Native compiler

```bash
bit import bit.envs/compilers/react-native -c
```

Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).

```bash
bit build
```

## Expending metro-config blacklist to ignore also .bit folder

In order to not receive this error from the metro when running the simulation: https://github.com/teambit/envs/issues/143  
Edit the `metro.config.js` file:

```
const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  ...
  resolver: {
    blacklistRE: blacklist([/.bit\/.*/]),
  },
};
```

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
                        "compilerPath": "@babel/cli/bin/babel",
                        "compilerArguments": ["./**/*", "--ignore", "node_modules,.dependencies,dist", "-d", "dist"],
                        "compiledFileTypes": [".js", ".jsx"],
                        "configFileName": "babel.config.json",
                        "babel": {
                            "plugins": [],
                            "presets": ["module:metro-react-native-babel-preset"],
                            "sourceMaps": false,
                            "minified": false
                        },
                        "development": false
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

- **compilerPath** - set the path to the compiler.
- **compilerArguments** - arguments options to run with the compiler.
- **compiledFileTypes** - file types to be compiled.
- **configFileName** - config file that the compiler should have.
- **babel** - override `babel.config.json` configuration.
- **development** - enable or disable dev mode to include source maps and better debugging capabilities.
- **copyPolicy** - manage the copy policy.
- **copyPolicy.ignorePatterns** - Array of patterns to exclude files from being copied.
- **copyPolicy.disable** - turn off the copy policy.

## F.A.Q

#### What are my configuration ?

The default configuration without dev mode or overrides is [here](./config.md).

## Got any issues or questions?

Collaboration on this Bit environment happens in [this repository](https://github.com/teambit/envs). Please open an issue or submit pull request there.
