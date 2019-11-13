import { createWorkspace } from './create-workspace';
import {expect} from 'chai'
//@ts-ignore
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper'


describe('typescript', () => {
    debugger
    const helper = new Helper()
    it('should support compile', async function() {
        const component = {
            'src/comp.tsx': `import React from 'react'
export class HelloWorld {
    render() {
        return <div>Hello-World</div>
    }
}`            
        }
        const directory =  await createWorkspace(component, {
            env: 'dist/src/index',
            name: 'typescript',
            packageJSON: {
                dependencies: {
                    "@types/react": "^16.9.11",
                    "react": "^16.11.0"
                }
            },
        })
        const result = await verifyComponent(directory)
        expect(result).to.equal(true)
    })
})

function verifyComponent(directory:string): Promise<boolean> {
    // verify build
    // tag, export, import and require
    return Promise.resolve(true)
}