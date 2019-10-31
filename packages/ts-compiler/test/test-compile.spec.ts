import { createWorkspace } from './create-workspace';
import {expect} from 'chai'
import { verify } from 'crypto';

describe('typescript', () => {
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
            actions: [
                {
                    command: 'bit',
                    args: ['add', 'src/comp.tsx', '--id', 'comp']
                }, {
                    command: 'bit',
                    args: ['build']
                }
                
            ]
        })
        const result = verifyComponent(directory)
        expect(result).to.equal(true)
    })
})

function verifyComponent(directory:string): Promise<boolean> {
    // verify build
    // tag, export, import and require
    return Promise.resolve(true)
}