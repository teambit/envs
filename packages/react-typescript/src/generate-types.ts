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
      return fs.writeFile(`${file}.d.ts`, content);
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

function getGenericStyle() {
  return `
    declare const style:readonly {[k:string]:string}
    export = styles;
    `;
}
function getSVGType() {
  return `
    import * as React from 'react';
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    const src:string
    export default  src
    `;
}
function getImageType() {
  return `
    const image: string;
    export default image;
    `;
}
