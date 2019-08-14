import { expect } from 'chai'
import { WorkspaceHelper, WorkspaceOptions } from './workspace-helper'
import path from 'path';

describe('should build', function () {
    const fixtures = getFixtures()
    for (let i = 0; i< fixtures.length; ++i) {
        let curr = fixtures[i]
        it(curr.name, async function () {               
            const helper = new WorkspaceHelper()
            const createRes = await helper.create(curr)
            const buildRes = await helper.build(curr)

            expect(createRes).to.equal(true)
            expect(buildRes).to.equal(true)
        })
    }
})

export function getFixtures() { 
    return [{
        path: path.resolve('./fixtures/ts-compiler-happy'),
        name: 'ts-compiler-happy',
        compiler: 'ts-compiler',
        target: ''
    }]
}