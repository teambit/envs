## Stencil Compiler

## Bootstrap tasks:

1. Get proper user oriented readme going.
2. Get sample case of components to render.
3. Get dev-server to render components.
4. implement compiler, consider the following:
   4.1 bundling, done with rollup.
   4.2 styles done with: less, postcss, sass, stylus - seems like plugin support.
   still need to figure out if I need to run those plugins or copy the components.
   4.3 testing done with
5. support prerender option for anchor component
6. support `{ type: 'dist-hydrate-script' }` to allow SSR
7. testing --- will not support jest
