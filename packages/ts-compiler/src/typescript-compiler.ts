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
    return this.preset.getDynamicPackageDependencies ? this.preset.getDynamicPackageDependencies(ctx) : {};
  }

  public getDynamicConfig(ctx: CompilerContext) {
    const presetConfig = this.preset.getDynamicConfig ? this.preset.getDynamicConfig(ctx.rawConfig) : {};
    return merge({}, presetConfig, ctx.rawConfig);
  }

  public async action(compilerContext: CompilerContext): Promise<ActionReturnType> {
    return await compile(compilerContext, this.preset);
  }

  get logger(): Logger | undefined {
    return this._logger;
  }
}
