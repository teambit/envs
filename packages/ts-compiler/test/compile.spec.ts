import Helper from 'bit-bin/dist/e2e-helper/e2e-helper'
import { expect } from 'chai'
import { promises as fs } from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import { createWorkspace } from './create-workspace'

describe('typescript', () => {
  const helper = new Helper()
  const results: {
    directory: string
    files: string[]
  } = {
    directory: '',
    files: [],
  }
  before(async function() {
    this.timeout(1000 * 10 * 10)
    const component = {
      'src/comp.tsx': `import React from 'react'
export class HelloWorld {
    render() {
        return <div>Hello-World</div>
    }
}`,
      'src/test.css': '',
      'src/types.d.ts': '',
      'src/try.svg': '',
    }
    results.directory = await createWorkspace(component, {
      env: 'dist/src/index.js',
      name: 'typescript',
      packageJSON: {
        dependencies: {
          '@types/react': '^16.9.11',
          react: '^16.11.0',
        },
      },
    })
    helper.scopeHelper.initWorkspace(results.directory)
    helper.command.addComponent('src/comp.tsx', {}, results.directory)
    helper.command.runCmd('bit add src/test.css --id comp', results.directory)
    helper.command.runCmd('bit add src/types.d.ts --id comp', results.directory)
    helper.command.runCmd('bit add src/try.svg --id comp', results.directory)
    helper.command.runCmd('bit build comp', results.directory)
    // const output = helper.env.command.runCmd('bit build comp', results.directory)
    // console.log('------------output------------')
    // console.log(output)
    // console.log('------------output------------')
    results.files = await fs.readdir(path.join(results.directory, '/dist'))
  })
  after(async () => {
    return new Promise((resolve, reject) => rimraf(results.directory, {}, error => (error ? reject() : resolve())))
  })
  it('build should pass', async () => {})
  it('build should exclude default ignore patterns', async () => {
    expect(results.files.indexOf('package.json')).to.equal(-1)
    expect(results.files.indexOf('tsconfig.json')).to.equal(-1)
  })
  it('should have a declaration file', () => {
    expect(!!~results.files.indexOf('comp.d.ts')).to.be.true
  })
  it('should copy non dist files', () => {
    expect(!!~results.files.indexOf('test.css')).to.be.true
    expect(!!~results.files.indexOf('types.d.ts')).to.be.true
    expect(!!~results.files.indexOf('try.svg')).to.be.true
  })
})
