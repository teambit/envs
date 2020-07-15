import Vinyl from 'vinyl';
import * as path from 'path';
import { promises as fsp, existsSync } from 'fs';
import { logger } from './logger';

export async function moveFiles(rootDir: string, files: Vinyl[], targetDir?: string): Promise<Vinyl[]> {
  targetDir = targetDir || 'src';
  await fsp.mkdir(path.resolve(rootDir, targetDir));
  for (const file of files) {
    logger(`file: ${file.path}`);
    const fileDir = path.dirname(file.path);
    if (fileDir !== '.' && !existsSync(path.resolve(rootDir, targetDir, fileDir))) {
      logger(`create dir: ${fileDir}`);
      await fsp.mkdir(path.resolve(rootDir, targetDir, fileDir));
    }
    await fsp.rename(path.resolve(rootDir, file.path), path.resolve(rootDir, targetDir, file.path));
    file.path = path.join(targetDir, file.path);
  }
  return files;
}
