import { createWorkspace } from './create-workspace';
import {expect} from 'chai'
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper'
import {promises as fs} from 'fs'
import rimraf from 'rimraf'

describe('typescript', () => {
    const helper = new Helper()
    const results: {
        directory: string,
        files: string[]
    } = {
        directory: '',
        files: []
    }
    before(async function (){
        this.timeout(1000 * 10 * 10)
        const component = {
            'src/comp.tsx': `import React from 'react'
export class HelloWorld {
    render() {
        return <div>Hello-World</div>
    }
}`            
        }
        results.directory =  await createWorkspace(component, {
            env: 'dist/src/index.js',
            name: 'typescript',
            packageJSON: {
                dependencies: {
                    "@types/react": "^16.9.11",
                    "react": "^16.11.0"
                }
            },
        })
        helper.scopeHelper.initWorkspace(results.directory)
        helper.command.addComponent('src/comp.tsx', {}, results.directory)
        helper.env.command.buildComponentWithOptions('comp',{}, results.directory)
        results.files = await fs.readdir(results.directory)
    })
    after(async function () {
        return new Promise((resolve, reject) => rimraf(results.directory, {}, (error) => error ? reject(): resolve()))
    })
    it('build should pass', async function() {})
    it('build should exclude default ignore patterns', async function() {
        expect(results.files.indexOf('package.json')).to.equal(-1)
        expect(results.files.indexOf('tsconfig.json')).to.equal(-1)
    })
})
