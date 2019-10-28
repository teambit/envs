import { createWorkspace } from './create-workspace';

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
            env: '',
            name: 'typescript',
            packageJSON: {
                dependencies: {
                    "@types/react": "^16.9.11",
                    "react": "^16.11.0"
                }
            }
        })
        console.log('directory is:', directory)

    })
})