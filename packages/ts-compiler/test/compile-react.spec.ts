import { createWorkspace } from './create-workspace';
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper'
import { GenericObject } from '../src/compiler';
import {presetStore} from '../src/preset'
import { expect } from 'chai';
import rimraf = require('rimraf');

describe('typescript react', () => {
    const helper = new Helper()
    const results: {
        directory: string,
        files: string[],
        showComponent: GenericObject
    } = {
        directory: '',
        files: [],
        showComponent: {}
    }
    before(async function (){
        this.timeout(1000 * 10 * 10)
        const component = {
            'src/comp.tsx': `import React from 'react'
import style from './test.css'
import svgs from './try.svg'
export class HelloWorld {
    render() {
        return <div>Hello-World</div>
    }
}`,            
            'src/test.css': '',
            'src/types.d.ts': '',
            'src/try.svg': ''
        }
        const pureComponent = {...component}
        results.directory =  await createWorkspace(component, {
            env: 'dist/test/typescript-react.js',
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
        Object.keys(pureComponent).forEach((relativeFilePath)=> {
            helper.command.runCmd(`bit add ${relativeFilePath} --id comp`, results.directory)    
        })
        helper.command.runCmd('bit build comp', results.directory)
        results.showComponent = JSON.parse(helper.command.runCmd('bit show comp --json', results.directory))
    })
    after(async function () {
        return new Promise((resolve, reject) => rimraf(results.directory, {}, (error) => error ? reject(): resolve()))
    })
    it('build should pass', async function() {})
    it('should have correct dependencies', function () {
       const presetConfig = presetStore.REACT.getDynamicPackageDependencies!()
       expect(results.showComponent.compilerPackageDependencies).to.deep.equal(presetConfig)
    })
  
})
