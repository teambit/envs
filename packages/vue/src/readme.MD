# Vue-Compiler

This is a Vue compiler based on [vue-cli 3](https://cli.vuejs.org/) for building vue components for [Bit](https://github.com/teambit/bit). The compiler works with Vue single file components.  

## Features

- Support [single file components](https://vuejs.org/v2/guide/single-file-components.html)
- Supports css, sass and less in scoped and global modes
- Supports javascript and typescript
- Generates a library target in `commonjs` format

## Usage

You can use this compiler in a bit workspace containing Vue components:

```bash
bit import -c bit.envs/compilers/typescript
bit build
```

The component is built in an isolated "capsule" that is not impacted by the project configuration. To view the capsule directory use:  

```bash
DEBUG=true bit build
```

## Configuration

Support for configuration and plugins is coming soon.  
