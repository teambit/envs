(WIP) Babel Compiler
--------------

Support for the Babel abstract transpiler.

**example bit.json**
```javascript
{
    "bit": {
        "env": {
            "compiler": {
                "@bit.envs/compilers/babel": {}
            }
        }
    }
}
```


**Configuration**

The compiler comes with the following *default* configuration:
```
{
  "presets": [
    [
      "@babel/preset-env"
    ]
  ]
}
```

In order to override this configuration:

Either include a [babel configuration file](https://babeljs.io/docs/en/config-files) when defining the compiler:
```
{
    "bit": {
        "env": {
            "compiler": {
                "@bit.envs/compilers/babel": {
                    "files": {
                        ".babelrc": "/path/to/my/.babelrc",
                    }
                }
            }
        }
    }
}
```

Or set specific fields directly in the `rawConfig` section:
```
{
    "bit": {
        "env": {
            "compiler": {
                "@bit.envs/compilers/babel": {
                    "rawConfig": {
                        "presets": [ [ "@babel/preset-react" ], { useBuiltins: true } ]
                    }
                }
            }
        }
    }
}
```

Note: These options can be combined. If they are, they override each other in the following order of precedence:
1. Explicit configuration options in rawConfig
2. Options defined in the babel configuration file
3. Compiler defaults

**Features**
The compiler will detect plugins/presets/transforms automatically and install them as `devDependencies`

**Isolation**

Bit will use the capsule API to isolate the component from the rest of the project. In case compilation fails you may debug an isolated environment by using `env DEBUG=true bit build` which keeps the capsule in the `/tmp/bit/cpausle-[uuid]` folder.
