# Jest Testers

A Jest component tester for [Bit](https://github.com/teambit/bit).
This tester follows our best practices guide for testing shared components.

## How to use?

In order to run this extension your must have a [bit workspace](https://docs.bit.dev/docs/concepts#bit-workspace) with at least one component defined, for more information on how to test please read the [docs](https://docs.bit.dev/docs/testing-components) section on the bit website. TL;DR version:

Install the Jest tester

```
$ bit import -c bit.envs/testers/jest
```

Then, you can simply test the component using `bit test`

```
$ bit test
```

## Features

- **Test components in isolation** - Testing shared components in true isolation is both challenging and important. It helps to find reusability issues quickly and early throughout the development process. It makes sure your components will run tests identically anywhere. Read more about isolation [here](https://docs.bit.dev/docs/ext-concepts.html#what-is-an-isolated-component-environment).

- **Unified UX** - Regardless of the testing tool you use across components you will have a unified testing experience. Bit provides a clear error interface that all testers must abide. This lets users to seeth through components without adjusting to a new tool.

## Configuration

```js
{
    "bit": {
        "env": {
            "compiler": {
                "bit.envs/testers/jest@[version]": {
                    "rawConfig: {
                        "jest-config": {},
                    }
                }
            }
        }
    }
}
```
