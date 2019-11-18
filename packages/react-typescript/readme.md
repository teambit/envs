# Typescript-React 

Based on the https://bit.dev/bit/envs/compilers/typescript  compiler. Read more there.


# A Component compiler for React components using TypeScript.
Compiles a React component for [TypeScript](https://www.typescriptlang.org/).

## How to use?

Import the environment
```bash
bit import bit.envs/compilers/react-typescript -c
```

Then build using [bit build](https://docs.bitsrc.io/docs/cli-build.html).
```bash
bit build
```

 ## What's inside

- Compiles `ts` and `tsx` files.
- Emit `d.ts` files.
- In order to see which typescript config are used, take a look at the [`tsconfig.json`](https://bit.dev/bit/envs/compilers/react-typescript/~code#tsconfig.json) file.

## Got any issues or questions?

Collaboration on this Bit environment happens in [this repository](https://github.com/teambit/envs). Please open an issue or submit pull request there.