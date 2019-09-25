# A component bundler for Vue components.
Compiles and bundles a [Vue](https://vuejs.org) component.

Please note that while bundling components is possible, it is [recommended to transpiling components](https://docs.bit.dev/docs/best-practices.html#prefer-transpiling-over-bundling)

## How to use?

Import the environment.
```bash
bit import bit.envs/bundlers/vue -c
```

Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).
```bash
bit build
```

## What's inside

- Compiles and bundles using [webpack](https://webpack.js.org/) with [vue-loader](https://github.com/vuejs/vue-loader).
- s[a|c]ss support.

## Reconfiguring this environment

In case the configuration presets in the `webpack.config.js` file of this component are not well suited to your needs, follow [these steps](https://discourse.bit.dev/t/can-i-modify-a-build-test-environments/28) to modify it.

## Got any issues or questions?

Collaboration on this Bit environment happens in [this repository](https://github.com/teambit/bit.envs). Please open an issue or submit pull request there.
