# Bit-Angular Compiler

**Please note, this environment is still experimnental, use this with caution.**  
**Works with bit version >= 14.2.3**

Bit environment for transpiling Angular components according to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview#heading=h.k0mh3o8u5hx).
Beneath the surface, this Bit compiler uses [ng-packagr](https://github.com/ng-packagr/ng-packagr).

## Installation

Install in your project using the following command:

```bash
bit import bit.envs/angular -c
```

## How to use?

Build your components after tracking them using [bit build](https://docs.bitsrc.io/docs/cli-build.html).

```bash
bit build
```

## Reconfiguring this environment

In case the configuration in the `ng-package.json` or `ts-config.json` files of this component are not well suited to your needs, follow [these steps](https://discourse.bit.dev/t/can-i-modify-a-build-test-environments/28) to modify it.

## Got any issues or questions?

Collaboration on this Bit environment happens in [this repository](https://github.com/teambit/bit.envs). Please open an issue or submit pull request there.
