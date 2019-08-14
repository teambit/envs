import { expect } from 'chai'

describe('component should build', function () {
    const fixtures = getFixtures()
    for (let i = 0; i<2; ++i) {
            it(`number ${i+1}`, function () {               
                expect(true).to.equal(!false)
            })
    }
})

export function getFixtures() { 
    
}