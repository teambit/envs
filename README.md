# Envs - Development environments for components

[![Actions Status](https://github.com/teambit/envs/workflows/CI/badge.svg)](https://github.com/teambit/envs/actions)

<a href="https://opensource.org/licenses/Apache-2.0"><img alt="apache" src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"></a>
[![Gitter chat](https://badgen.now.sh/badge/chat/on%20gitter/cyan)](https://gitter.im/bit-src/Bit)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A curated list of **Extensions** maintained by Bit's [maintainers](https://github.com/orgs/teambit/people) to use as dev tools for components. These extensions implement best practices for distributing components and setting them up to be reused across projects.

<p align="center">
  <a href="https://bit.dev/bit/envs"><img src="https://storage.googleapis.com/bit-docs/Screen%20Shot%202019-06-06%20at%201.26.32%20PM.png"></a>
</p>

[Browse Envs](https://bit.dev/bit/envs) • [Implementing Envs](https://docs.bit.dev/docs/building-components.html)

[Compiler/Tester collection](https://bit.dev/bit/envs) • [Docs](https://docs.bit.dev/docs/building-components.html)

## Packages

1. **Typescript** - [packages/ts-compiler](https://github.com/teambit/envs/tree/master/packages/ts-compiler)
2. **Common** - [packages/common](https://github.com/teambit/envs/tree/master/packages/common)
3. **Vue** - [packages/vue](https://github.com/teambit/envs/tree/master/packages/vue)

## What is Bit?

**Bit makes it easy to share and manage components between projects and apps at any scale**.

It lets you **isolate components** from existing projects with **0 refactoring**, with **fully-automated dependency definition/resolution** and **scalable versioning**.

It lets you **reuse individual components across projects**, using your favorite package managers like **npm** and **yarn** through **[Bit's component hub](https://bit.dev)**. It also lets you **extend Git's workflow** to **develop components from any consuming project**, suggest updates and **easily sync changes across your codebase**.

### What are Components?

A component is a [focused, independent, reusable, small & testable](https://addyosmani.com/first/) piece of code that has a single responsibility. Bit handles components as first-class citizens and provides workflows that utilize these properties to share common components between projects. The primary purpose of using components in this context is UI components for the web, like React, Angular, Vue, WebComponents, etc.

## The problem with sharing components

When writing a shared code, there is a need to agree on the consumption method. For example, when developers who write vanilla code would like to share it with TypeScript teams (and vice versa). In most cases, even similar flavors of components may have different needs in terms of configurations and dependencies. To collaborate well, we would like to decouple the logic from the way we build and test. This way, we can apply fixes and move around the code base with little consideration to every build and test detail. This is a problem faced by any team that attempts to write a shared library of components.

## What is an Environment?

Environments are Bit extensions that enable developers to develop Bit components by providing integration between Bit and the developer's toolset. Additionally, they implement smart defaults and best practices when it comes to dealing with the component reusability. Use environments as an infrastructure and API for setting components to be distributed and reused by other developers.

## How Bit Environments work?

There are several important things to take into consideration when setting up a component to be reused in other projects. **Environments** implements the following solutions for them.

### Component isolation feedback loop

When building code as part of an app, we can create unknown side effects, for example:

- Dependencies may be resolved even if not declared.
- Some states may be derived from the global scope.
- Complicated and deep dependency graphs for components.

It's important to understand these unknowns and create a feedback loop that allows fixing them.  
To achieve component isolation, Bit provides the extension with the Capsule APIs to create a separate development environment, detached from the original workspace and codebase. It then runs all operations (build, test, render, etc.) on the isolated environment to provide feedback.

### Target compilation

We use tools like WebPack and Rollup to bundle a web application to a single target that contains all dependencies and assets. It is the application's responsibility to create runnable bundles for the browser. Components should only be compiled to a reusable target a bundler can consume. This process has several benfits:

- No bundled duplicate dependencies.
- No loss of data (CSS classes turned to hash).
- Enhances bundler features like tree-shaking and code splitting.

If we accept this reasoning, the ideal target format for components is - **ESM2015**.

> While there are still gaps in support of ESM2015 by browsers, bundlers handle this module system very well.

#### Shared styles

It is essential to understand how component sharing works with the different techniques of styling in Web development. Each technique affects the consumer differently.

##### Native CSS

This method refers to having a basic `.css` file alongside the component. While there are inherent issues with the global scope, which makes it inadvisable for styling components, some projects still prefer this method.

When such method is used, the consuming app should handle it by bundling the `.css` files of its dependencies. This is why when an Environment finds this type of file, it merely copies it and ships it with the transpiled output of the component.

##### Style pre-processors and CSS Modules

This method refers to using CSS transpilers like Less, Sass and Scss. Using such tools is very helpful, as different bundlers can use these styles to create vars, scoped classes, and other features. This styling method, much like the way native CSS works, needs to be managed by the consuming project's bundler. This is usually done by configuring a specific plugin that handles the type of pre-processor.

##### CSS in JS

CSS-in-JS is a methodology that uses Javascript objects which describe the different styles. It styles the component during runtime, while the JavaScript code is being evaluated. Components designed using this method should be handled like any other JavaScript code. Unlike the previously discussed styling options, here, the consumer does not need to do anything, as Bit already transpiles the JS objects alongside the implementation itself.

#### Testing

Testing is code which verifies that a component is functioning as expected of it. Many guides were written about the benefits of testing ([here](https://martinfowler.com/articles/microservice-testing/) [are](https://medium.com/javascript-scene/tdd-changed-my-life-5af0ce099f80) [some](https://www.youtube.com/watch?v=AoIfc5NwRks)). An important question is raised when we run our test: Which asset should be tested - source or target? Bit decided to test the target code. The main benefits of running the test over sources are source map support, and ease of use/debug. On the other hand, to have better confidence that the code will work in the consumer environment, it is preferred to test the target code over source code. This is because it also detects compilation-related errors.

## How to contribute?

Before submitting a PR please read our [code of conduct](https://github.com/teambit/bit/blob/master/CODE_OF_CONDUCT.md).

When creating a new environment please provide the following:

1. A proposal document that describes the configuration options, tradeoffs and practices that are implemented.
2. A PR with tests that covers the main points from the doc.
3. Provide three projects the environment is applicable to and tested on.

## License

Apache License, Version 2.0 - see [here](https://github.com/teambit/envs/blob/master/LICENSE)
