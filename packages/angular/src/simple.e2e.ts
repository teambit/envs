import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import path from 'path';

const FIXTURES = [
  {
    name: 'HelloWorld.css',
    folder: 'src',
    content: `
    div {
      background-color: #68bb5d;
      color: white;
    }
  `
  },
  {
    name: 'HelloWorld.html',
    folder: 'src',
    content: `
  <div>
    Hello World
  </div>
  `
  },
  {
    name: 'HelloWorld.ts',
    folder: 'src',
    content: `
  import { Component } from '@angular/core';
  
  @Component({
    selector: 'hello-world',
    templateUrl: './HelloWorld.html',
    styleUrls: ['./HelloWorld.css']
  })
  export class HelloWorld {
  }
  `
  },
  {
    name: 'HelloWorld.module.ts',
    folder: 'src',
    content: `
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { HelloWorld } from './HelloWorld';
  
  @NgModule({
    declarations: [
      MyComponent
    ],
    imports: [
      CommonModule
    ],
    exports: [
      MyComponent
    ]
  })
  export class HelloWorldModule { }
  `
  }
];

describe('Angular compiler', (): void => {
  let helper: Helper;
  beforeAll((): void => {
    process.env.DEBUG = 'true';
    helper = new Helper();
  });
  beforeEach((): void => {
    helper.scopeHelper.reInitLocalScope();
  });

  afterAll((): void => {
    helper.scopeHelper.destroy();
  });

  it('should compile a simple Angular component', (): void => {
    const COMP_ID = 'hello-world';
    FIXTURES.forEach((f): void => {
      helper.fs.createFile(f.folder, f.name, f.content);
    });
    helper.command.addComponent('src', { i: COMP_ID, m: 'src/HelloWorld.module.ts' });
    const bitJson = helper.bitJson.read();
    (bitJson.env = {
      compiler: {
        meta: {
          options: {
            file: path.join(__dirname, '../dist/index.js')
          }
        }
      }
    }),
      helper.bitJson.write(bitJson);
    helper.command.build(COMP_ID);
    expect(helper.fs.getConsumerFiles('dist/*.*')).toEqual([
      'dist/demo.html',
      'dist/hello-world.common.js',
      'dist/hello-world.umd.js',
      'dist/hello-world.umd.min.js'
    ]);
  });
});
