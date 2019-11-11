Envs - Development environments for bit components
------------------------------------------------

A collection of bit extensions required for the development life cycle of a bit component.

<p align="center">
  <a href="https://bit.dev/bit/envs"><img src="https://storage.googleapis.com/bit-docs/Screen%20Shot%202019-06-06%20at%201.26.32%20PM.png"></a>
</p>

[Compiler/Tester collection](https://bit.dev/bit/envs) • [Docs](https://docs.bit.dev/docs/building-components.html)

Packages
---------------

1. **Typescript** - [packages/ts-compiler](https://github.com/teambit/envs/tree/master/packages/ts-compiler) 
2. **Common** - [packages/common](https://github.com/teambit/envs/tree/master/packages/common) 
3. **Vue** - [packages/vue](https://github.com/teambit/envs/tree/master/packages/vue) 

What is bit? 
-------------
Bit is an echo system for creating, maintaining and collaborating around javascript components. It's composed from the bit cli, an open source tool which acts as a distributed network of components. The component is a small, sharable and reusable code part. It may be created and consumed in one project (author) and shared with others (consumers). Consumers may offer changes and push back code if they are allowed. The second part is the bit.dev component cloud. This is where open source components are shared with the world and closed source components can be shared with teams and selected groups of users. This give you the power of search and discoverability over large scale units of code. For more information on bit read the [docs](https://docs.bit.dev/docs/what-is-bit).

Why do we need environments?
-----------------------------
There is more then one way to skin a cat, hence there is more then one way to maintain a component. When consuming source code you need to agree on that way. Users which write vanilla code would like to share it with typescript users and vice versa. Even very similar flavors of components may have different needs in terms of configurations and dependencies. In order to collaborate well, we would like to decouple the logic from the way we build and test the component. This way we can apply fixes and move around the code base with little consideration to every build and test detail.

Environments are bit extensions which are aimed to help with the development of bit components and accommodate reusability. They solve that by providing integration betweens bit and the authors development tool set. They also aim to provide smart defaults and best practices when it comes to dealing with the component medium.

Concepts
-------
**Isolation** - When building code as part of an app we can create unknown side effects. Dependencies may be resolved even if not declared, some state may be derived from the global scope. We would like to shed light on these unknowns and create a feedback loop which allows the developer to fix it. Bit isolation layer is here to provide insights and feedback on that process. If a dependency is implicit and bit doesn't detect it, it won't be isolated. This will cause errors and alert the author that some changes need to apply. 

In order to achieve that bit exposed the capsule API for the extension system. This way an env can run the component's build and test detached from the original workspace. A gap between results in the workspace and results in the capsule shows the developer there is an issue with reusing code. The developer can then apply changes and repeat the process until he gets the desirable results.

**Compilation**
Compilation is the process of converting source code to consumable code (a.k.a target). An environment needs to output all the information needed for the code to be consumed. In the use case of web apps, many times, we create bundles which can be consumed by the browser. In the world of components we would like to generate target code which can be used by an app or other components. Bundling normally attaches the components dependencies to the result and may loose some data (css classes turned to hashes etc). In order to keep this information and keep application size to minimum, the following rule of thumb was coined:

Prefer transpilation over bundling!

It is the application responsibilty to create runable bundles. We need only to create reusable target consumed by those bundlers. Transpilation of components allows us to remain flexible no matter the use case the component is used in. If we accept this reasoning then the ideal target format becomes apparent - ESM2015. While there are still gaps in the support of the format by browsers, bundlers handle this module system very well. This keeps the target future proof for when ESM will be wide spread. Unless stated otherwise, we target ESM2015

**Testing**
Testing is code which verifies that a component is functioning as expected of it. Many guides were written for the benefits of tests (here are some). An important question is raised when we run our test and that is: Which asset should be tested, source or target? Bit made the decision to test target code. The main benefits of running test over sources is derived from source maps support and ease of use/debug. On the other hand in order to have better confidence that the code will work in the consumer environment it is prefer to test the target code over source code.  

**Style Reusing**
When thinking about javascript component we also have to consider the style of a UI component. How do we support the reusing and composition of styles? In order to consider that we need to think about the different ways that one can style a component. 

1. Native CSS - Not the recommended way to handle styles for components due to issues with scope but it is supported
2. CSS in JS  - Is composed of Javascript objects which describes the different styles. Should be handled normally like any other Javascript code. 
3. Style pre-processor - Copied to the target dir to allow bundlers to reuse things like var, scoped classes etc. 

How to contribute ?
----------------
Before submitting a PR please read our [code of conduct](https://github.com/teambit/bit/blob/master/CODE_OF_CONDUCT.md). 

When creating a new environment please provide the following:

1. A proposal document which describes the configuration options, tradeoffs and practices that are implemented.
2. A PR with tests which covers the main points from the doc. 
3. Provide 3 projects the environment is applicable and tested on.
