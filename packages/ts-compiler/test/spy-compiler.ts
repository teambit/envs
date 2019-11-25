import sinon from 'sinon';
import { TypescriptCompiler } from '../src/typescript-compiler';
import {presetStore} from '../src/preset'
const toSpy = new TypescriptCompiler(presetStore['REACT']);
export default toSpy;
