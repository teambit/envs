TS Compiler
--------------

Support for the Typescript language using tsc. 

**How to use?**

Import the environment.

```bash
bit import bit.envs/compilers/react -c
```

Then build using bit build.

```bash
bit build
```

**Supported**

1. Copy policy.
2. Static configuration with the compiler (fork to change).

**Features:**

**Configuration** The compiler will read the author environment `tsconfig.json` and will adapt it to the structure of the component. Detection of config will happen automatic unless directed otherwise by the user. The user may also override specific `tsconfig.json` from the bit.json file. This is to correct a situation when a 
config makes sense in the project but not in a component and vice versa. Some dependencies are implicitly deduced from `tsconfig.json` and not from the codebase. 
TS-compiler will use bit's API to add those dependencies to the component.

Some configuration is imposed on tsc from bit: 

1. The entry of a component and the entry of a project are different. This will force configuration change around `files`|`include`.
2. for now multilayer configuration isn't supported so `extends` keyword will be omitted. Missing config can be done with overrides. 
3. The order of configuration will be : project, compiler, bit.json where bit.json is most important.

**Isolation** Bit will use the capsule API to isolate the component from the rest of the project so `tsc` will only walk the needed imports. In case compilation fails you may debug an isolated environment by using `env DEBUG=true bit build` which keeps the capsule in the `/tmp/bit/cpausle-[number]` folder.

**Copy policy** - Files which don't get compiled will be copied to the dist.

**Preset** Allow the users to choose configuration from a list of predefined configs or bit-ID

**example bit.json**
```javascript
{
    "bit": {
        "env": {
            "compiler": {
                "@bit.envs/compilers/typescript": {
                    "rawConfig": {
                        // this overrides tsconfig.json from the project/compiler.
                    },
                    "files": {
                        "tsconfig": "./tsconfig.json", // naming the configuration file.
                    },
                    "options": {
                        "preset": "" // bitId or some name like react
                    }
                }
            }
        }
    }
}
```





