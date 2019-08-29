Babel Compiler
--------------

Support for the Babel abstract transpiler.

**Features**

**Configuration** The compiler will detect plugins/presets automatically and set them to ```devDependencies```.

**Isolation** Bit will use the capsule API to isolate the component from the rest of the project so `tsc` will only walk the needed imports. In case compilation fails you may debug an isolated environment by using `env DEBUG=true bit build` which keeps the capsule in the `/tmp/bit/cpausle-[number]` folder.

**Asset/CSS support - Copy policy** The user may enter glob patterns for sources which will be copied to the target directory as is. This will support CSS/Images/fonts. 

**Preset** - Several popular presets will be defined in the compiler 

**example bit.json**
```javascript
{
    "bit": {
        "env": {
            "compiler": {
                "@bit.envs/compilers/typescript": {
                    "rawConfig": {
                        "forceTransformRuntime": false, //https://babeljs.io/docs/en/babel-runtime
                        "copyToTarget": "*.{css,md}", // -> consider an array
                        "preset":  "default" | "vue" | "react" | "[bit-id]"
                    },
                    "files": {
                        ".babelrc": ".babelrc",
                    },
                    "options": {}
                }
            }
        }
    }
}
```





