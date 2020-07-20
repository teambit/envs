import * as fs from 'fs';

jest.mock('fs');

import { createTS } from './typescript.utils';

describe('typescript utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should write a tsconfig json file', async () => {
    await createTS('/temp', {}, {});
    expect(fs.writeFileSync).toHaveBeenCalledWith('/temp/tsconfig.json', '{}');
  });

  it('should return deep merged value', async () => {
    const writeMock = jest.spyOn(fs, 'writeFileSync');
    await createTS(
      '/temp',
      {
        compilerOptions: {
          target: 'esnext',
          module: 'esnext',
          paths: {
            '@/*': ['src/*'],
            '~/*': ['./*'],
          },
          lib: ['esnext', 'dom', 'dom.iterable', 'scripthost'],
        },
        exclude: ['node_modules', '.bit'],
      },
      {
        compilerOptions: {
          module: 'CommonJS',
          paths: {
            '~root': [''],
          },
        },
      },
      {
        exclude: ['test1', 'test2'],
      }
    );
    expect(JSON.parse(writeMock.mock.calls[0][1])).toMatchInlineSnapshot(`
      Object {
        "compilerOptions": Object {
          "lib": Array [
            "esnext",
            "dom",
            "dom.iterable",
            "scripthost",
          ],
          "module": "CommonJS",
          "paths": Object {
            "@/*": Array [
              "src/*",
            ],
            "~/*": Array [
              "./*",
            ],
            "~root": Array [
              "",
            ],
          },
          "target": "esnext",
        },
        "exclude": Array [
          "node_modules",
          ".bit",
          "test1",
          "test2",
        ],
      }
    `);
  });
});
