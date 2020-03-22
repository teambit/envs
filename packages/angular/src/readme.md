# Bit-Angular Compiler

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

## Contents

- The compiler uses @angular 9 and ng-packagr v9 for building.
- Compiler adds `webpack-env >= 0.8.0` and `tslib >= 1.0.0`
- The compiler creates an ng-package.json file, if one does not exist. Otherwise, it will use the existing one.
