TS Compiler
--------------

Support for the Typescript language using tsc. 

Features:
----------
1. Configuration - read local tsconfig.json 
2. Configuration - Provide overrides to config inline in (bit/package.json).
3. Dynamic dependencies - support dynamic dependencies if needed. 
4. DEBUG mode - `env DEBUG=true bit build` keeps capsule and prints messages. 
5. Isolation - using the capsule API to isolate the component. 
6. Copy policy - support CSS/Asset by setting copy (default)/no-copy strategy. 

Config:
-------
Project config and component aren't the same due to possible change in entry point.
The following limitations apply:

1. tsconfig.json `files` | `include` entry may change by the compiler.
2. import helpers will be forced to false - changed by override // TODO: add path.
3. 

Overrides may be used normally to change component config. To override tsconfig use this in bit.json

example bit.json 

```javascript
//TODO:
```




