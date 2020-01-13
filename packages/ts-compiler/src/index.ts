import { TypescriptCompiler } from './typescript-compiler';
import { typeScriptPreset } from './typescript-preset';

export { TypescriptCompiler };
export default new TypescriptCompiler(typeScriptPreset);
