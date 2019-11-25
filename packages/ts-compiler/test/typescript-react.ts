import { TypescriptCompiler } from '../src/typescript-compiler';
import { presetStore } from '../src/preset';

export default  new TypescriptCompiler(presetStore['REACT']);
