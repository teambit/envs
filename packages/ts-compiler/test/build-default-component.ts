import { createWorkspace } from './create-workspace';
import Helper from 'bit-bin/dist/e2e-helper/e2e-helper';
import path from 'path';
import fs from 'fs-extra';
import { GenericObject } from '../src/compiler';

export type BuildResult = {
  directory: string;
  files: string[];
  showComponent: GenericObject;
};

export type BuildOptions = {
  shouldPrintOutput?: boolean;
  shouldDebugEnvironment?: boolean;
  compilerPath?: string;
  disableBuildStep?: boolean;
  component?: GenericObject;
};

export const defaultComponent = {
  'src/comp.tsx': `import React from 'react'
export class HelloWorld {
    render() {
        return <div>Hello-World</div>
    }
}`,
  'src/test.css': '',
  'src/types.d.ts': '',
  'src/try.svg': ''
};

export async function buildComponentInWorkspace(helper: Helper, opts?: BuildOptions): Promise<BuildResult> {
  const results: BuildResult = { directory: '', files: [], showComponent: {} };
  const component = (opts && opts.component) || defaultComponent;
  results.directory = await createWorkspace(component, {
    env: (opts && opts.compilerPath) || 'dist/src/index.js',
    name: 'typescript',
    packageJSON: {
      dependencies: {
        '@types/react': '^16.9.11',
        react: '^16.11.0'
      }
    }
  });
  helper.scopeHelper.initWorkspace(results.directory);
  helper.command.addComponent('src/comp.tsx', {}, results.directory);
  helper.command.runCmd('bit add src/test.css --id comp', results.directory);
  helper.command.runCmd('bit add src/types.d.ts --id comp', results.directory);
  helper.command.runCmd('bit add src/try.svg --id comp', results.directory);
  let output = '';
  if (!opts || opts.disableBuildStep !== true) {
    output = helper.env.command.runCmd(getCommandString(opts), results.directory);
    results.files = await fs.readdir(path.join(results.directory, '/dist'));
  }

  if (opts && opts.shouldPrintOutput) {
    console.log('------------output------------');
    console.log(output);
    console.log('------------output------------');
  }

  results.showComponent = JSON.parse(helper.command.runCmd('bit show comp --json', results.directory));

  return results;
}

function getCommandString(opts?: BuildOptions) {
  return opts && opts.shouldDebugEnvironment ? `node --inspect-brk $(which bit) build comp` : `bit build comp`;
}
