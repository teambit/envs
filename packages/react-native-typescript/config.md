### Default Configuration used in capsule

```js
{
 "compilerOptions": {
   "rootDir": "./",
   "outDir": "dist",
   "target": "esnext",
   "module": "commonjs",
   "moduleResolution": "node",
   "lib": [
     "es6"
   ],
   "allowJs": true,
   "jsx": "react",
   "esModuleInterop": true,
   "resolveJsonModule": true,
   "experimentalDecorators": true,
   "sourceMap": true,
   "declaration": true,
   "isolatedModules": true,
   "allowSyntheticDefaultImports": true,
   "inlineSourceMap": false,
   "inlineSources": true,
   "removeComments": false,
   "typeRoots": [
     "./node_modules/@types"
   ],
   "importHelpers": false
 },
 "include": [
   "./**/*"
 ],
 "exclude": [
   "node_modules",
   ".dependencies",
   "dist"
 ]
}
```
