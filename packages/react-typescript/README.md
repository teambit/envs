# React-Typescript Compiler

A TypeScript component compiler for [Bit](https://github.com/teambit/bit). 
Check out the [best practices](https://docs.bit.dev/docs/best-practices) and also the specific [React guidelines](https://docs.bit.dev/docs/react-guidelines).

The compiler is also heavily based on [typescript](https://github.com/teambit/envs/blob/master/packages/ts-compiler/README.md) compiler.

## How to use?

In order to run this extension your must have a [bit workspace](https://docs.bit.dev/docs/concepts#bit-workspace) with at least one component defined, for more information on how to build please read the [docs](https://docs.bit.dev/docs/building-components) section on the bit website. TL;DR version:

Install the React-Typescript compiler

```
$ bit import -c bit.envs/compilers/react-typescript
```

Then, you can simply build the component using `bit build`

```
$ bit build
```

