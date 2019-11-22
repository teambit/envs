import sinon from 'sinon';
import { TypescriptCompiler } from '../src/typescript-compiler';

const toSpy = new TypescriptCompiler('REACT');
export const spy = sinon.spy(toSpy, 'action');
export default toSpy;
