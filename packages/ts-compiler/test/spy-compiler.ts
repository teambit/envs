import sinon from 'sinon';
import { TypescriptCompiler } from '../src/typescript-compiler';
import { typeScriptPreset } from '../src/typescript-preset';

const toSpy = new TypescriptCompiler(typeScriptPreset);
export default toSpy;
