import { getSourceFiles, getTestFiles, readFiles, isTestFile } from './files.utils';
import Vinyl from 'vinyl';
import mockFs from 'mock-fs';

describe('files utils', () => {
  const files = [
    new Vinyl({
      path: './folder/a.ts',
      test: false,
    }),
    new Vinyl({
      path: './folder/b.js',
      test: false,
    }),
    new Vinyl({
      path: './folder/c.jpg',
      test: false,
    }),
    new Vinyl({
      path: './folder/d.ts',
      test: true,
    }),
  ];

  describe('source files', () => {
    it('should return source files that match extensions', () => {
      expect(getSourceFiles(files, ['ts']).length).toEqual(1);
      expect(getSourceFiles(files, ['ts', 'js']).length).toEqual(2);
      expect(getSourceFiles(files, []).length).toEqual(3);
    });
  });
  describe('test files', () => {
    it('should return test files that match extensions', () => {
      expect(getTestFiles(files, ['ts']).length).toEqual(1);
      expect(getTestFiles(files, ['ts', 'js']).length).toEqual(1);
      expect(getTestFiles(files, []).length).toEqual(1);
    });
  });
  describe('Read files', () => {
    it('should read all files and return a vinyl', async () => {
      const CAPSULE_DIR = 'capsule-101';
      mockFs({
        [CAPSULE_DIR]: {
          'comp.js': 'dummy content',
          'comp.map.js': 'dummy content',
          images: {
            'image.png': 'dummy content',
          },
        },
      });
      let result = await readFiles(CAPSULE_DIR);

      // do restore immediately after read https://github.com/facebook/jest/issues/5792
      mockFs.restore();
      expect(result![0].path).toEqual('comp.js');
      expect(result![0].contents).toBeTruthy();
    });
  });
  describe('is test file', () => {
    it('should return true if file extension match test extensions', () => {
      expect(isTestFile('./folder/a.חs')).toEqual(false);
      expect(isTestFile('./folder/folder/a.js')).toEqual(false);
      expect(isTestFile('./folder/a.ts')).toEqual(false);
      expect(isTestFile('./folder/folder/a.ts')).toEqual(false);

      expect(isTestFile('./folder/a.spec.js')).toEqual(true);
      expect(isTestFile('./folder/a.test.js')).toEqual(true);
      expect(isTestFile('./folder/a.e2e.js')).toEqual(true);

      expect(isTestFile('./folder/a.spec.ts')).toEqual(true);
      expect(isTestFile('./folder/a.test.ts')).toEqual(true);
      expect(isTestFile('./folder/a.e2e.ts')).toEqual(true);
    });
  });
});
