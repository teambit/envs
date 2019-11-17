import Vinyl from 'vinyl';

const getFilesList = (files: Vinyl[]) => {
  const list: { [key: string]: any } = {};

  files.forEach(file => {
    if (list[file.stem] && list[file.stem][0].endsWith('.js')) {
      // no-op
      // prefer js files over any other (eg .vue) files
      //
      // TODO: this should be done by pointing to the component main file
      // rather than doing this hack
    } else {
      list[file.stem] = [file.path];
    }
  });

  return list;
};

export default getFilesList;
