# Envs - Development environments for bit components

A collection of Bit extensions required for the development lifecycle of Bit components.

<p align="center">
  <a href="https://bit.dev/bit/envs"><img src="https://storage.googleapis.com/bit-docs/Screen%20Shot%202019-06-06%20at%201.26.32%20PM.png"></a>
</p>

[Compiler/Tester collection](https://bit.dev/bit/envs) • [Docs](https://docs.bit.dev/docs/building-components.html)

## Packages

1. **Typescript** - [packages/ts-compiler](https://github.com/teambit/envs/tree/master/packages/ts-compiler)
2. **Common** - [packages/common](https://github.com/teambit/envs/tree/master/packages/common)
3. **Vue** - [packages/vue](https://github.com/teambit/envs/tree/master/packages/vue)

## What is Bit?

[Bit](www.github.com/teambit/bit) provides an eco-system for creating, maintaining, and collaborating around JavaScript components. It allows a distributed component management workflow, so both maintainers and consumers can collaborate on components together.

### What are Components?

A component is a [focused, independent, reusable, small & testable](https://addyosmani.com/first/) piece of code that has a single responsibility. Bit handles components as first-class citizens and provides workflows that utilize these properties to share common components between projects.  
The primary purpose of using components in this context is UI components for the web, like React, Angular, Vue, WebComponents, etc.

### The problem with sharing components

When writing a shared code, there is a need to agree on the consumption method. For example, developers who write vanilla code would like to share it with TypeScript teams (and vice versa). In most cases, even similar flavors of components may have different needs in terms of configurations and dependencies.  
To collaborate well, we would like to decouple the logic from the way we build and test. This way, we can apply fixes and move around the code base with little consideration to every build and test detail.  
To solve these issues, Bit implements Environments.

## What is an Environment?

Environments are Bit extensions that are aimed to help with the development of Bit components and accommodate reusability. They provide integration between Bit and the developers' toolset. Additionally, they implement smart defaults and best practices when it comes to dealing with the component medium.  
Use environments as an underline infrastructure and API for setting components to be distributed and reused by other developers.

### Concepts

#### Isolation

When building code as part of an app, we can create unknown side effects. Dependencies may be resolved even if not declared, and some states may be derived from the global scope. It's important to understand these unknowns and create a feedback loop that allows the developer to fix it.  
Bit uses an isolation layer to provide insights and feedback on that process. For example, if a dependency is implicit, the component can't be genuinely isolated, as this will cause errors when trying to consume the component in a project that lacks the implicit dependency.

To achieve component isolation, Bit exposes a set of Capsule APIs for the extension system to use. Using these APIs, an environment can run the component's build and test pipelines detached from the original workspace.  
Any gap between results in the workspace and the results of the environment pipe shows that there will be an issue with reusing the component. The developer can then apply changes and repeat the process until they get the desirable results.

#### Compilation

Compilation is the process of converting source code to consumable code (a.k.a target). The Environment needs to output all the information for the code to be consumed.  
In the case of a web application, many times, we create bundles that can be consumed by the browser. Bundling usually attaches the dependencies to the result and may lose some data (CSS classes turned to hashes, etc.). When handling components, we would like to generate a target code that can be used by an app or other components.

Prefer transpilation over bundling!

This would allow the consumer with more flexibility and improve the performance of their app, as features like tree-shaking and dependencies deduping don't work on bundled code.  
The reason being that it is the application's responsibility to create runnable bundles. Components should only by reusable target consumed by those bundlers. Transpilation of components allows us to remain flexible no matter the use case the component is used in. If we accept this reasoning, the ideal target format becomes apparent - **ESM2015**.

> While there are still gaps in support of ESM2015 by browsers, bundlers handle this module system very well.

#### Testing

Testing is code, which verifies that a component is functioning as expected of it. Many guides were written for the benefits of tests (here are some). An important question is raised when we run our test, and that is: Which asset should be tested source or target? Bit decided to test the target code. The main benefits of running the test over sources are derived from source maps support, and ease of use/debug. On the other hand, to have better confidence that the code will work in the consumer environment, it is preferred to test the target code over source code.

#### Styling

In the world of Web UI styling generally refers to the CSS (and all its flavors) that attached to the component (recently there's a going trend about CSS-in-JS, more about that later). It is essential to understand how the sharing of components works with the different techniques of styling in Web development. Each technique affects the consumer differently.  
Bit supports all standard practices for style management.

##### Native CSS

This method refers to having a basic `.css` file alongside the component. While there are inherent issues with the global scope, which makes it not the recommended way for components, some projects still prefer this method.  
When a Bit extension finds this type of file, it merely copies it and ships it with the transpiled output of the component's build process. This means that a project that consumes a component that was styled using a `.css` file should bundle the `.css` files as well.

##### Style pre-processors and CSS Modules

This method refers to the using of CSS transpilers that gives more features on top of native CSS, to improve the development experience. Using such tools is very helpful, as different bundlers can use it to create vars, scoped classes, and other features that make this methodology work well with developing components.  
Similar to how Bit handles native CSS styling - this too needs to be managed by the consuming project's bundlers, usually by configuring a specific plugin that handles the type fo pre-processor.

##### CSS in JS

CSS-in-JS is a methodology that uses Javascript objects which describe the different styles. It styles the component during runtime, with the JavaScript code is being evaluated.  
Components that designed using this method should be handled like any other JavaScript code. Unlike the previously discussed styling options, here, the consumer does not need to do anything, as Bit already transpiles the JS objects alongside the implementation itself.

## How to contribute?

Before submitting a PR please read our [code of conduct](https://github.com/teambit/bit/blob/master/CODE_OF_CONDUCT.md).

When creating a new environment please provide the following:

1. A proposal document that describes the configuration options, tradeoffs and practices that are implemented.
1. A PR with tests that covers the main points from the doc.
1. Provide 3 projects the environment is applicable and tested on.
