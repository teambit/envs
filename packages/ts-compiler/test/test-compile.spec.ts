import {expect} from 'chai'
import { createWorkspace } from './create-workspace';

describe('typescript', () => {
    it('should support compile', function() {
        const directory = createWorkspace({
            'a.ts':`
                export print(msg:string) {
                    console.log(msg)
                }
            `
        }, {
            env:''
        })

        console.log('directory', {})

    })
})