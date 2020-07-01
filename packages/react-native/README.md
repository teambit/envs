# React-Native compiler

A React-Native component compiler for [Bit](https://github.com/teambit/bit).

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

## What's inside

- Compiles `js` and `jsx` files.
- In order to see which babel presets and plugins are used, take a look at the [config.md](config.md) file.

## Metro has encountered an error while trying to resolve module 'react-native'...

If you get this error, you need to expend the metro-config blacklist to ignore also `.bit` folder.
Link to the issue https://github.com/teambit/envs/issues/143  
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

## F.A.Q

#### What are my configuration ?

The default configuration without dev mode or overrides is [here](./config.md).

## Got any issues or questions?

Collaboration on this Bit environment happens in [this repository](https://github.com/teambit/envs). Please open an issue or submit pull request there.
