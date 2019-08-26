TS Compiler
--------------

Support for the Typescript language using tsc. 

**Features:**

**Configuration** The compiler will read the author environment `tsconfig.json` and will adapt it to the structure of the component. Detection of config will happen automatic 
unless directed otherwise by the user. The user may also override specific tsc configuration from the bit.json file. This is to correct a situation when a 
config makes sense in the project but not in a component and vice versa. Some dependencies are implicitly deduced from tsconfig.json and not from the codebase. 
TS-compiler will use bit's API to add those dependencies to the component 

Some configuration is imposed on tsc from bit: 

1. `ImportHelpers` (a.k.a `tslib`) is forced to false by default because the pattern makes less sense in a component perspective. This may be configured by using the following key in `bit.json` - 
2. The entry of a component and the entry of a project are different. This will force configuration change around `files`|`include`.
3. for now multilayer configuration isn't supported so `extends` keyword will be omitted. Missing config can be done with overrides. 

**Isolation** Bit will use the capsule API to isolate the component from the rest of the project so `tsc` will only walk the needed imports. In case compilation fails you may debug an isolated environment by using `env DEBUG=true bit build` which keeps the capsule in the `/tmp/bit/cpausle-[number]` folder.

**Asset/CSS support - Copy policy** The user may enter glob patterns for sources which will be copied to the target directory as is. This will support CSS/Images/fonts etc. 

**Future** Allow the users to choose configuration from a list of predefined configs (TODO - make config files, decide on key in bit.json). Support the automatic generation of typescript `d.ts` files for component.


**example bit.json**
```javascript
{
    "bit": {
        "env": {
            "compiler": {
                "@bit.envs/compilers/typescript": {
                    "rawConfig": {
                        "forceImportHelpers": false,
                        "copyToTarget": "*.{css,md}",
                        "preset":  "default" | "none"
                    },
                    "files": {
                        "tsconfig": "./tsconfig.json",
                    },
                    "options": {}
                }
            }
        }
    }
}
```





