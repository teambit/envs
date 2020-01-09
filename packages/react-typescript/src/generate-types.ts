import readdir from 'recursive-readdir';
import fs from 'fs-extra';

export async function generateTypes(_dir: string) {
  const strategies = getStrategies();
  const dir = await readdir(_dir, ['node_modules', 'dist', '.dependencies']);
  const filesToCreate = dir.filter(file => Object.keys(strategies).some(extension => file.endsWith(`.${extension}`)));
  return await Promise.all(
    filesToCreate.map(file => {
      const extension = file.split('.')[file.split('.').length - 1];
      const content = (strategies as any)[extension];
      const dtsFilePath = `${file}.d.ts`;
      if (!fs.existsSync(dtsFilePath)) {
        return fs.writeFile(dtsFilePath, content);
      }
      return Promise.resolve();
    })
  );
}

function getStrategies() {
  const strategies = {
    css: getGenericStyle(),
    sass: getGenericStyle(),
    scss: getGenericStyle(),
    svg: getSVGType(),
    jpg: getImageType(),
    jpeg: getImageType(),
    webp: getImageType(),
    png: getImageType(),
    ico: getImageType(),
    gif: getImageType(),
    bmp: getImageType()
  };
  return strategies;
}

export function getGenericStyle() {
  return `
  declare const style: {[k:string]:string};
  export default style;
    `;
}

export function getSVGType() {
  return `
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  declare const src:string;
  export default src;
    `;
}

export function getImageType() {
  return `
    declare const image: string;
    export default image;
    `;
}
