import fs from 'fs-extra';
import Vinyl from 'vinyl';
import path from 'path';
import readdir from 'recursive-readdir';

function mapExtensions(extensions: string[]) {
  return extensions.map((e) => `.${e}`);
}

/**
 * Return true if the file path include a test extension
 * @param dir Path of the file
 */
export function isTestFile(dir: string): boolean {
  const testExtensions = ['.spec.js', '.test.js', '.e2e.js', '.spec.ts', '.test.ts', '.e2e.ts'];
  let testFile = false;
  testExtensions.map((ext) => {
    if (dir.endsWith(ext)) {
      testFile = true;
    }
  });
  return testFile;
}

/**
 * Return all source files (not tests) with specific extensions or [] for all
 * @param sources list of sources to review
 * @param extensions list of extensions to match
 */
export function getSourceFiles(sources: Vinyl[], extensions: string[] = []): Vinyl[] {
  return sources.filter(
    (s) => (extensions.length > 0 ? mapExtensions(extensions).includes(s.extname) : true) && !s.test
  );
}

/**
 * Return all tests files with specific extensions or [] for all
 * @param sources list of sources to review
 * @param extensions list of extensions to match
 */
export function getTestFiles(sources: Vinyl[], extensions: string[] = []): Vinyl[] {
  return sources.filter(
    (s) => (extensions.length > 0 ? mapExtensions(extensions).includes(s.extname) : true) && !!s.test
  );
}

/**
 * Return files in directory as set of Vinyls relative to the dist directory
 * @param dir Path to read files from
 */
export async function readFiles(dir: string): Promise<Vinyl[] | undefined> {
  const dirFiles = await readdir(dir);
  const files = dirFiles.map(async (f) => {
    return new Vinyl({
      path: path.relative(dir, f),
      contents: await fs.readFile(f),
      test: isTestFile(f),
    });
  });
  return Promise.all(files);
}
