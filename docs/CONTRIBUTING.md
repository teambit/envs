## How to use project?

First clone the project

```bash
$ git clone https://github.com/teambit/envs
#for ssh
$ git clone git@github.com:teambit/envs
```

install dependencies

```bash
$ cd envs
$ npm i
```

build typescript compiler

```
$ cd packages/ts-compiler
$ npm run build
```

Consume in project by configuring the compiler dist in options.file.

- go to consumer project.
- edit package.json or bit.json
- form this:

```js
// package.json
{
    "bit": {
        "env": {
            "compiler":"bit.envs/compilers/typescript@3.1.0"
        }
    }
}

```

- to this:

```js
// package.json
{
    "bit": {
        "env": {
            "compiler": {
                "bit.envs/compilers/typescript@3.1.0": {
                    "options": {
                        "file": "[path-to-envs-repo]/packages/ts-compiler/dist/src/index.js"
                    }
                }
            }
        }
    }
}
```

to run the compiler run bit build in the workspace.

```bash
$ bit build
```

to debug run use node inspect protocol

```bash
$ node --inspect-brk $(which bit) build
```

if you wish to debug a tester make sure you cancel fork level.

```bash
$ node --inspect-brk $(which bit) test --fork-level=NONE
```
