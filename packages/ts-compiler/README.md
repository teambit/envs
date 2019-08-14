TS Compiler
--------------

Support for the Typescript language using tsc. 

Features:
----------
1. Configuration - read local tsconfig.json 
2. Configuration - Provide overrides to config inline in (bit/package.json).
3. DEBUG mode - `env DEBUG=true bit build` keeps capsule and prints messages. 
4. Isolation - using the capsule API to isolate the component. 
5. Copy policy - support CSS/Asset support by setting copy (default)/no-copy strategy. 

Config:
-------
Project config and component aren't the same due to possible change in entry point.
The following limitations apply:

1. Files entry may change by the compiler.
2. 

Overrides may be used normally to change component config. To override tsconfig use this in bit.json

TODO: enter override.
TODO: Go over tsconfig.json for more options.



