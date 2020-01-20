import { merge } from 'lodash';
import { compile } from './compile';
import { ActionReturnType, Compiler, CompilerContext, InitAPI, Logger } from '@bit/bit.envs.common.compiler-types';
import { Preset } from '@bit/bit.envs.common.preset';

export class TypescriptCompiler implements Compiler {
  private _logger: Logger | undefined;

  constructor(private preset: Preset = {}) {
    this.getDynamicPackageDependencies = this.getDynamicPackageDependencies.bind(this);
    this.getDynamicConfig = this.getDynamicConfig.bind(this);
    this.action = this.action.bind(this);
  }

  public init(ctx: { api: InitAPI }) {
    this._logger = ctx.api.getLogger();
    return {
      write: true
    };
  }

  public getDynamicPackageDependencies(ctx: CompilerContext, name?: string) {
    const deps = this.preset.getDynamicPackageDependencies ? this.preset.getDynamicPackageDependencies() : {};
    return deps;
  }

  public getDynamicConfig(ctx: CompilerContext) {
    //this.preset.getDynamicConfig receive CompilationContext type, a this function receive CompilerContext, we need to update the type of this function to receive GenericObject.
    //CompilationContext > CompilerContext > rawConfig
    //@ts-ignore
    const presetConfig = this.preset.getDynamicConfig ? this.preset.getDynamicConfig(ctx.rawConfig) : {};
    const config = merge({}, presetConfig, ctx.rawConfig);
    return config;
  }

  public async action(compilerContext: CompilerContext): Promise<ActionReturnType> {
    const compileResult = await compile(compilerContext, this.preset);
    return compileResult;
  }

  get logger(): Logger | undefined {
    return this._logger;
  }
}
